/**
 * Dev tool: finds CC0 / public-domain photo candidates on Wikimedia Commons for each image
 * slot and writes labelled contact sheets, so photos are chosen by looking, not by title.
 *
 *   node scripts/photo-search.mjs <workdir> [slot …]
 *
 * Commons search is a logical AND: keep queries to one or two words. The Unsplash archive
 * on Commons (CC0, full resolution) is tried first. Network calls go through curl, which
 * passes where Node's fetch times out on upload.wikimedia.org.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SLOTS = {
  tomatoes: ['tomatoes', 'tomato'],
  'cherry-tomatoes': ['cherry tomatoes', 'cherry tomato'],
  'kapia-pepper': ['red pepper', 'pointed pepper', 'peppers'],
  'california-pepper': ['bell peppers', 'paprika', 'peppers'],
  'chili-peppers': ['chili peppers', 'chili', 'chillies'],
  eggplant: ['eggplant', 'aubergine', 'eggplants'],
  zucchini: ['zucchini', 'courgette'],
  'green-beans': ['green beans', 'beans'],
  avocado: ['avocado', 'avocados'],
  citrus: ['oranges', 'citrus', 'mandarins'],
  strawberries: ['strawberries', 'strawberry'],
  raspberries: ['raspberries', 'raspberry'],
  blueberries: ['blueberries', 'blueberry'],
  watermelon: ['watermelon', 'watermelons'],
  melon: ['melon', 'cantaloupe', 'melons'],
  'iqf-strawberries': ['frozen strawberries', 'frozen strawberry', 'frozen fruit'],
  'iqf-blackberries': ['blackberries', 'blackberry', 'frozen blackberries'],
  'iqf-raspberries': ['frozen raspberries', 'frozen berries', 'raspberries'],
  'iqf-blueberries': ['frozen blueberries', 'frozen berries', 'blueberries'],
  'scene-fresh': ['vegetables', 'vegetable market', 'fresh vegetables'],
  'scene-vegetables': ['greenhouse', 'tomato greenhouse', 'vegetable field'],
  'scene-fruits': ['fruit', 'orchard', 'fruit market'],
  'scene-frozen': ['frozen berries', 'frozen fruit', 'berries'],
  'scene-about': ['farm', 'agriculture', 'farmland'],
  'scene-morocco': ['Morocco agriculture', 'Agadir', 'Morocco farm', 'Souss'],
  'scene-mediterranean': ['Almeria greenhouses', 'Spain agriculture', 'orange grove'],
  'scene-logistics': ['container ship', 'truck highway', 'containers port'],
  'hero-still': ['field aerial', 'farm aerial', 'crops'],
  'blog-early-season': ['strawberry field', 'strawberry farm', 'harvest'],
  'blog-souss-massa': ['greenhouses', 'greenhouse', 'polytunnel'],
};

const [, , WORK, ...only] = process.argv;
if (!WORK) {
  console.error('usage: node scripts/photo-search.mjs <workdir> [slot …]');
  process.exit(1);
}
mkdirSync(WORK, { recursive: true });

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'EuraviaSiteBuilder/1.0 (contact: info@euraviafoods.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function curlJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const body = execFileSync('curl', ['-s', '--max-time', '60', '-A', UA, url], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      return JSON.parse(body);
    } catch {
      // Throttled: Commons answers in plain text past ~1 request a second. Wait, retry.
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 4000);
    }
  }
  return null;
}

const FREE = /^(cc0|public domain|pd)/i;

async function search(query) {
  const titles = [];
  for (const q of [`${query} Unsplash`, query]) {
    const url = `${API}?action=query&list=search&srnamespace=6&srlimit=30&format=json&srsearch=${encodeURIComponent(q)}`;
    const data = curlJson(url);
    for (const hit of data?.query?.search ?? []) if (/\.(jpe?g)$/i.test(hit.title)) titles.push(hit.title);
    await sleep(1200);
  }
  const out = [];
  for (let i = 0; i < titles.length; i += 20) {
    const batch = titles.slice(i, i + 20);
    const url = `${API}?action=query&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=360&format=json&titles=${encodeURIComponent(batch.join('|'))}`;
    const data = curlJson(url);
    for (const page of Object.values(data?.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      const licence = info.extmetadata?.LicenseShortName?.value ?? '';
      if (!FREE.test(licence)) continue;
      if (info.width < 1500 || info.width < info.height * 1.2) continue;
      out.push({ title: page.title, width: info.width, height: info.height, thumb: info.thumburl, licence });
    }
    await sleep(1500);
  }
  return out;
}

async function sheet(slot, candidates) {
  const cell = { w: 360, h: 240 };
  const cols = 4;
  const picks = candidates.slice(0, 16);
  let n = 0;
  const tiles = [];
  for (const [i, c] of picks.entries()) {
    const file = join(WORK, `${slot}-${i}.jpg`);
    if (!existsSync(file)) {
      try {
        execFileSync('curl', ['-s', '-f', '-L', '--max-time', '60', '-A', UA, '-o', file, c.thumb]);
      } catch {
        continue;
      }
    }
    try {
      const img = await sharp(file).resize(cell.w, cell.h, { fit: 'cover' }).toBuffer();
      const label = Buffer.from(
        `<svg width="${cell.w}" height="28"><rect width="100%" height="100%" fill="black" opacity="0.7"/><text x="8" y="19" font-size="16" font-family="Arial" fill="white">${i} · ${c.width}px</text></svg>`
      );
      const x = (n % cols) * cell.w;
      const y = Math.floor(n / cols) * cell.h;
      n++;
      tiles.push({ input: img, left: x, top: y }, { input: label, left: x, top: y });
    } catch {
      /* unreadable thumbnail */
    }
  }
  const rows = Math.ceil(n / cols) || 1;
  await sharp({ create: { width: cols * cell.w, height: rows * cell.h, channels: 3, background: '#222' } })
    .composite(tiles)
    .jpeg({ quality: 78 })
    .toFile(join(WORK, `sheet-${slot}.jpg`));
}

const result = {};
for (const [slot, queries] of Object.entries(SLOTS)) {
  if (only.length && !only.includes(slot)) continue;
  const seen = new Set();
  const found = [];
  for (const q of queries) {
    for (const c of await search(q)) {
      if (seen.has(c.title)) continue;
      seen.add(c.title);
      found.push(c);
    }
    if (found.length >= 16) break;
  }
  result[slot] = found.slice(0, 16);
  await sheet(slot, result[slot]);
  console.log(`${slot}: ${found.length} candidates`);
  writeFileSync(join(WORK, `candidates-${slot}.json`), JSON.stringify(result[slot], null, 2));
}
