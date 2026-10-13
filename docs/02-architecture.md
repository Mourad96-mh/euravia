# 02 — Architecture decisions

Short ADRs (architecture decision records). Each one gives the decision, why, and what it costs.

## ADR-1 · Reuse the moreco.ma codebase, not a theme or a CMS

**Decision.** Start from `../moreco/web` (Next.js 16, static export, pure CSS modules) and
port only the generic parts: header, footer, hero, reveal, feature rows, page header, quote
basket, forms, PHP mailer, routing, export finalizer.

**Why.** The client asked for that exact design, and the code has already been through two
months of client feedback: hover bridges, the mobile drawer, reduced motion, the
WCAG target sizes, and a static export that is known to build on this machine.

**Cost.** Moreco-specific modules (trials, R&D, press, careers, brand ranges, 301 map) are
left behind. Euravia gets its own repository and doesn't share code with moreco
afterwards. That's deliberate: the two clients will diverge.

## ADR-2 · Static export, no CMS

**Decision.** `output: 'export'`: every page is pre-rendered HTML. Content lives in
typed data files and JSON dictionaries in the repo.

**Why.** 19 products and ~6 page types change rarely. Static output means no server, no
database, nothing to patch, very fast pages and a cheap host. Content edits stay a
one-file change (`data/catalog/*.json`, `i18n/dictionaries/*.json`).

**Revisit when** the client wants to publish blog posts weekly by themselves. That's the
point to add a headless CMS or a small admin (the pattern from Omar/Nuance Art).

## ADR-3 · Localised URLs from a route table

**Decision.** One catch-all route `app/[locale]/[[...path]]` resolved against
`data/routes.ts`. Words in URLs are localised (`/en/fresh/vegetables/`,
`/fr/frais/legumes/`, `/nl/vers/groenten/`), **product slugs too**
(`/en/…/tomatoes/`, `/fr/…/tomates/`, `/nl/…/tomaten/`). The shared word table is
`data/route-words.json`, also read by the sitemap script.

**Why.** A static export can't run middleware. A single table keeps routes, the language
switcher (it stays on the same page), hreflang and the sitemap in sync. Localised slugs
match what buyers type ("tomates du Maroc").

## ADR-4 · Locales: `en` (default), `fr`, `nl`

English is the source language and the dictionary type is inferred from `en.json`, so a missing key
in FR or NL fails the TypeScript build. Bare `/` serves a tiny language-picker page that
redirects using the remembered choice or the browser language (the moreco recipe).

## ADR-5 · Request-for-quote basket, not a shop

**Decision.** Keep the moreco quote basket. Products are added from cards and product
pages, the basket lives in `localStorage`, and `/quote/` posts the list + contact
details. The B2B fields that matter in produce are added: **volume / unit** (kg, pallets,
containers), destination country, Incoterm hint, desired period.

**Why.** Produce prices move weekly and depend on volume, so no price is ever published.

## ADR-6 · Forms → PHP mailer on the same host

**Decision.** `public/api/{contact,quote}.php` + `mailer.php` (SMTP login to the client's
mailbox, honeypot, origin check, 5 sends/hour per IP). The secrets are in `mail-config.php`,
which is git-ignored and denied over HTTP by `.htaccess`.

**Why.** Third-party form services failed on moreco (EmailJS 50 KB cap, FormSubmit 500s).
SMTP login passes SPF/DKIM, so the mails don't land in spam.

**Cost.** Needs a PHP host. On a host without PHP (Vercel preview) the forms say they
failed and show the e-mail address and WhatsApp link instead. They never pretend to have sent.

## ADR-7 · Images: CC0 stock now, the client's photos later

Every picture goes through `scripts/fetch-photos.mjs` (download from Wikimedia
Commons → crop/resize with `sharp` → WebP) and is listed in `public/media/CREDITS.json`
with its source and licence. Replacing a photo means dropping a file with the same name.

## ADR-8 · Build outside OneDrive

`.next` corrupts under a syncing OneDrive folder (see the moreco notes). `scripts/build.ps1`
mirrors the sources to `%TEMP%\euravia-build`, runs `npm ci` there (not a junction:
`npm ci` would empty the source `node_modules`), builds, and copies `out/` back.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | CSS Modules + design tokens in `app/globals.css` (no Tailwind, same as moreco) |
| Fonts | Inter via `next/font` (self-hosted at build time) |
| Images | Pre-sized WebP, `images.unoptimized` (no optimiser in an export) |
| Forms | PHP 5.6+ SMTP mailer |
| Hosting | Apache static host + PHP (Hostinger class), `.htaccess` generated |
| SEO | Per-page metadata, hreflang ×3 + x-default, `sitemap.xml`, `robots.txt`, JSON-LD |

## Folder layout

```
export-import/
  docs/                  these documents
  web/
    app/[locale]/        layout + catch-all page
    components/          Header, Footer, Hero, Reveal, FeatureRow, PageHeader,
                         ProductCard, Quote/*, Contact/*, Season, …
    views/               one file per page type
    data/                catalog.ts (structure), catalog/{en,fr,nl}.json (copy),
                         routes.ts, route-words.json, nav.ts, blog.ts
    i18n/                config + dictionaries/{en,fr,nl}.json
    public/media/        photos, hero film, brand
    public/api/          PHP mailers
    scripts/             build.ps1, finalize-export.mjs, fetch-photos.mjs
```
