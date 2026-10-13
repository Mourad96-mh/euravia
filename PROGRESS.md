# Euravia website — progress log

Client: Euravia (euraviafoods.com), B2B fresh & frozen produce, offices in Utrecht (NL) and
Casablanca (MA). Brief: `Website import & export.docx`. Design reference chosen by the client:
**moreco.ma/fr** (our own build, `../moreco/web`).

## 2026-10-11 — M0 → M5

- **M0 Discovery & docs**: `docs/01` → `07` (requirements, ADRs, IA/URLs, design system,
  SEO, quality plan, launch plan) + `docs/CONTENT-TO-VALIDATE.md`.
- **M1 Foundation**: `web/` scaffolded from the moreco code (header with utility bar +
  hover panels + drawer, video hero, reveal, page header, quote basket, PHP mailers, static
  export + build-outside-OneDrive script). Euravia palette (leaf green / sun orange / ice
  blue), placeholder sun-and-leaf wordmark.
- **M2 Catalogue**: 19 products × EN/FR/NL with localised slugs; Fresh hub with filter
  chips, Vegetables, Fruits, Frozen (IQF) pages, product sheets (facts table, highlights,
  season bar where the client gave one: eggplant Nov–Jun, related products).
- **M3 Brand pages**: Home (moreco structure: film hero, intro + 5 pillars, 3 range rows,
  featured products, two-offices route band, facts band, quote band), Euravia (about),
  Blog (3 starter articles), Contact (2 office cards + form), Privacy (GDPR).
- **M4 Conversion**: quote basket with quantity + unit (pallets/kg/containers), B2B quote
  form (destination, period), contact form; PHP SMTP mailers with honeypot, origin check,
  rate limit; honest failure message with e-mail + WhatsApp fallback.
- **M5 SEO/QA**: per-page metadata, canonical + hreflang ×3 + x-default, JSON-LD
  (Organization, BreadcrumbList, ItemList, Article), sitemap from built HTML, robots,
  `.htaccess` (https, www → apex, caching), branded 404, `check-export.mjs`.
- Media: hero = 12 s Mixkit montage (greenhouse tomatoes → produce spread → vegetables),
  3.2 MB; photos = Wikimedia Commons CC0 stand-ins listed in `public/media/CREDITS.json`.

## Resume here (stopped 2026-10-11 evening)

1. ~~Photos~~ done 2026-10-13: all 30 stand-ins on disk (public/media/CREDITS.json).
2. ~~og.jpg + euravia-logo.png~~ done 2026-10-13 via `node scripts/make-brand-assets.mjs`
   (re-run it when the real logo arrives).
2b. 2026-10-13: quote page has a "Send on WhatsApp" button (pre-filled message: basket +
   filled-in details) and "Delivery country" is a dropdown of the 7 export countries the client
   gave (ES, FR, NL, DE, DK, SE, NO + Other), in i18n `quote.destinations`.
3. Build: `powershell -ExecutionPolicy Bypass -File web/scripts/build.ps1`. The first build
   on 2026-10-11 compiled 96 pages (32 per language) and passed every check except the
   then-missing images.
4. Browser QA from docs/06 (responsive sweep, header/mega panel, drawer, basket, forms,
   reduced motion), screenshots, then a Vercel preview for the client.

## Open

- Client inputs: logo, photos, Melon copy, figures, certifications, packaging, hosting +
  mailbox, legal names/KvK, confirm EN/FR/NL (see `docs/01-discovery.md` §8).
- `mail-config.php` on the server, then a live test of both forms.
- Own git repository (do not commit into the Bureau-wide repo).
