# Euravia — euraviafoods.com

Static website for Euravia (fresh & frozen produce, Utrecht + Casablanca). Next.js 16
static export, pure CSS modules, three languages (EN default, FR, NL), quote basket, PHP
mailers. Design after moreco.ma, per the client's request. The decisions behind it are in
`../docs/`.

## Everyday tasks

| I want to… | Edit |
|---|---|
| Change a product text | `data/catalog/en.json` (+ `fr.json`, `nl.json`) |
| Add a product | `data/catalog.ts` (`PRODUCTS`) + one entry in each `data/catalog/*.json` + a photo `public/media/products/<id>.webp` |
| Give a product a season bar | `season: [11, 12, 1, …]` on it in `data/catalog.ts` |
| Change any interface text | `i18n/dictionaries/*.json` (English is the reference shape: a missing key fails the build) |
| Phones, addresses, e-mail, WhatsApp | `data/nav.ts` (`OFFICES`, `CONTACT`) |
| Write a blog article | `data/blog.ts` + a photo in `public/media/blog/` |
| Replace a photo | drop a file with the same name in `public/media/…` |
| Replace the logo | `components/Logo/Logo.tsx`, then the colours in `app/globals.css` |
| Change the hero film | `public/media/hero/hero.mp4` + `hero-poster.webp` |

## Commands

```bash
npm install
npm run dev            # http://localhost:3000/en/  (forms fail here: no PHP)
npx next typegen && npx tsc --noEmit
```

**Build** — always outside OneDrive (`.next` corrupts under a syncing folder):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

This mirrors the sources to `%TEMP%\euravia-build`, runs `next build`, then
`scripts/finalize-export.mjs` (language picker at `/`, `.htaccess`, `sitemap.xml`,
`robots.txt`, `404.html`) and `scripts/check-export.mjs` (one h1, titles, descriptions,
canonicals, hreflang ×4, no dead links or missing images, no English leaking into FR/NL).
The result is copied to `out/`.

## Deploy

1. Upload the **contents** of `out/` to the web root (Apache + PHP).
2. On the server, copy `api/mail-config.example.php` to `api/mail-config.php` and fill in
   the mailbox's SMTP settings. That file is never committed and never served.
3. Send a test contact message and a test quote.
4. Search Console: add the property, submit `/sitemap.xml`.

## Photos

`scripts/photo-search.mjs` (finds candidates + contact sheets) and
`scripts/fetch-photos.mjs` (downloads the choices listed in `scripts/photo-selection.json`,
crops, encodes WebP, writes `public/media/CREDITS.json`). All current photos are CC0 /
public-domain stand-ins; the hero film is a Mixkit montage (Mixkit free licence).
