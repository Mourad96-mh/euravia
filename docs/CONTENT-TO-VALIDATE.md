# Content to validate with the client

Everything on the site that **we** wrote or assumed, rather than copied from the client's
brief (`Website import & export.docx`). Each item says where it lives in the code.

## Written by us — please confirm or correct

| # | What | Where |
|---|---|---|
| 1 | **Melon** product text (the brief had none) | `web/data/catalog/*.json` → `melon` |
| 2 | Extra sentence on **Tomatoes** (calibre, colour, winter supply) | `catalog/*.json` → `tomatoes.body` |
| 3 | Extra sentence on **Green beans** ("hand-picked and graded") | `catalog/*.json` → `green-beans.body` |
| 4 | "Year-round" availability shown for chili peppers and the 4 IQF products | `catalog/*.json` → `availability` |
| 5 | Watermelon origin "Morocco · Spain" (the About text says Spain supplies watermelons) | `catalog/*.json` → `watermelon.origin` |
| 6 | The 5 home-page pillars, incl. "GlobalG.A.P. certification" as a company-wide claim (the brief only states it for eggplants) | `i18n/dictionaries/*.json` → `home.pillars` |
| 7 | Facts band: 19 products · 2 offices · 3 sourcing areas · −18 °C. **Replace with real figures** (years, tonnes, countries) when available | `home.facts` |
| 8 | Hero title and subtitle | `home.heroTitle`, `home.heroText` |
| 9 | Office roles: Utrecht = "European sales & logistics", Casablanca = "Sourcing & packing at origin" | `offices.*.role` |
| 10 | 3 blog articles (early season, IQF explained, Souss-Massa) | `web/data/blog.ts` |
| 11 | Privacy policy (standard GDPR text, 24-month retention, Dutch DPA) — needs legal entity names + KvK | `privacy.sections` |
| 12 | **WhatsApp** link points to the Moroccan mobile +212 6 03 74 81 01 | `web/data/nav.ts` → `CONTACT.whatsapp` |

## Edited from the brief

- "these **imported** tomatoes" → "our **Moroccan** tomatoes" (they are exported from Morocco).
- Grammar and spacing fixes throughout; meaning unchanged.
- California pepper, Chili, Eggplant headings ("Premium Moroccan…", "Bring the Heat…") were
  turned into the one-line taglines on the cards.

## Translations

French and Dutch versions of every page were written by us from the English. A native
reader on the client's side should proofread them, especially the product sheets.

## Photos and video

All pictures are **royalty-free stand-ins** (Wikimedia Commons CC0 / public domain, Mixkit
video licence), listed in `web/public/media/CREDITS.json`. They should be replaced with
the client's own photos (fields, greenhouses, packing station, cold store, trucks, team)
as soon as possible. Keep the same file names to replace them without touching code.

## Logo

The "Euravia" sun-and-leaf wordmark is a placeholder drawn by us
(`web/components/Logo/Logo.tsx`). Send the real logo and we swap it in one file, then re-tune
the colour tokens in `web/app/globals.css` to match it.
