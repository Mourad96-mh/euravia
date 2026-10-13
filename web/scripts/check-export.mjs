/**
 * Static checks over the built export (docs/06-quality-plan.md). Fails the build on:
 *   - a page without exactly one <h1>, a <title>, a meta description or a canonical
 *   - a page whose hreflang set is not en + fr + nl + x-default
 *   - an internal link or asset that does not exist in out/
 *   - a duplicate <title> within one language
 *   - English UI words leaking into /fr/ or /nl/
 *
 *   node scripts/check-export.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const LOCALES = ['en', 'fr', 'nl'];
const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

function pages(dir, base = '') {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory() || entry.startsWith('_')) continue;
    const rel = base ? `${base}/${entry}` : entry;
    if (existsSync(join(full, 'index.html'))) found.push(rel);
    found.push(...pages(full, rel));
  }
  return found;
}

const all = pages(OUT).filter((p) => LOCALES.includes(p.split('/')[0]));

/** A root-relative URL → the file that would serve it. */
function exists(url) {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (clean === '/' || clean === '') return true;
  const path = join(OUT, clean);
  if (clean.endsWith('/')) return existsSync(join(path, 'index.html'));
  return existsSync(path) || existsSync(join(path, 'index.html'));
}

/* Words that must not appear as visible UI text on a translated page. */
const LEAKS = ['Add to quote', 'Quote request', 'Fresh produce', 'Back to top', 'Request a quote', 'All rights reserved'];

const titles = new Map();
const checkedAssets = new Set();

for (const page of all) {
  const locale = page.split('/')[0];
  const html = readFileSync(join(OUT, page, 'index.html'), 'utf8');

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(page, `${h1} <h1>`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(page, 'no <title>');
  else {
    const key = `${locale}|${title}`;
    if (titles.has(key)) fail(page, `duplicate title with ${titles.get(key)}: "${title}"`);
    titles.set(key, page);
  }

  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(page, 'no meta description');
  if (!/<link rel="canonical" href="https:\/\/euraviafoods\.com\//.test(html)) fail(page, 'no canonical');

  const langs = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)"/gi)].map((m) => m[1]).sort();
  if (langs.join(',') !== 'en,fr,nl,x-default') fail(page, `hreflang set is [${langs.join(',')}]`);

  for (const [, url] of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('/_next/') || url.startsWith('//')) continue;
    if (url.startsWith('/api/')) continue;
    if (checkedAssets.has(url)) continue;
    checkedAssets.add(url);
    if (!exists(url)) fail(page, `broken link or asset: ${url}`);
  }
  for (const [, list] of html.matchAll(/srcSet="([^"]+)"/g)) {
    for (const part of list.split(',')) {
      const url = part.trim().split(' ')[0];
      if (url.startsWith('/') && !exists(url)) fail(page, `broken srcset: ${url}`);
    }
  }

  if (locale !== 'en') {
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    for (const word of LEAKS) if (text.includes(word)) fail(page, `English leak: "${word}"`);
  }
}

if (!existsSync(join(OUT, 'sitemap.xml'))) fail('out', 'no sitemap.xml');

const perLocale = LOCALES.map((l) => `${l}: ${all.filter((p) => p.startsWith(`${l}/`) || p === l).length}`).join(', ');
if (errors.length) {
  console.error(`check-export: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-export: ${all.length} pages OK (${perLocale}), ${checkedAssets.size} internal URLs resolved`);
