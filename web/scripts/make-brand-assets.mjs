/**
 * Raster copies of the stand-in wordmark (components/Logo/Logo.tsx) for the places that can't
 * take inline SVG: the JSON-LD logo (brand/euravia-logo.png) and the share image (og.jpg,
 * 1200×630, hero poster + logo). Re-run after replacing the logo:
 *   node scripts/make-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SUN = '#e9792b';
const BRAND = '#1f6b3f';

const logo = (ink, vein) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 48" width="208" height="48">
  <circle cx="24" cy="17" r="9" fill="${SUN}"/>
  <path d="M8 41c0-13 9.5-22 26-22 0 14.5-9.5 22-21 22H8Z" fill="${ink}"/>
  <path d="M11 39c6-6.5 11.5-10.5 18-13.5" stroke="${vein}" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <text x="46" y="30" fill="${ink}" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2.5">EURAVIA</text>
  <text x="47" y="43" fill="${ink}" font-family="Segoe UI, Arial, sans-serif" font-size="8.6" font-weight="600" letter-spacing="3" opacity="0.72" textLength="156" lengthAdjust="spacingAndGlyphs">FRESH · FROZEN · FOODS</text>
</svg>`;

mkdirSync('public/media/brand', { recursive: true });

// JSON-LD logo: Google wants at least 112×112, so render wide and pad onto white.
await sharp(Buffer.from(logo(BRAND, '#fff')), { density: 600 })
  .resize({ width: 960 })
  .extend({ top: 60, bottom: 60, left: 60, right: 60, background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile('public/media/brand/euravia-logo.png');

// Share image: the hero poster, darkened at the bottom, with the logo in white.
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0.35" stop-color="#0f3a21" stop-opacity="0"/>
    <stop offset="1" stop-color="#0f3a21" stop-opacity="0.85"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`);
const mark = await sharp(Buffer.from(logo('#ffffff', BRAND)), { density: 400 }).resize({ width: 560 }).png().toBuffer();

await sharp('public/media/hero/hero-poster.webp')
  .resize(1200, 630, { fit: 'cover' })
  .composite([
    { input: shade, top: 0, left: 0 },
    { input: mark, left: 72, top: 630 - 72 - Math.round((560 * 48) / 208) },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/media/og.jpg');

console.log('wrote public/media/brand/euravia-logo.png and public/media/og.jpg');
