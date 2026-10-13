# 01 — Discovery & requirements

_Euravia Foods website · written 2026-10-11_

## 1. The client

**Euravia** (euraviafoods.com) is a B2B trading house. It sources, packs and supplies **fresh
and frozen (IQF) fruit and vegetables**, mainly from **Morocco** (Souss-Massa, the
northern and coastal regions), and also from **Spain and the wider Mediterranean**. It sells
to international retailers, distributors, wholesalers and food-industry buyers (hot-sauce
makers, catering).

| Office | Address |
|---|---|
| Netherlands | Mississippidreef 95, 3565 CE Utrecht |
| Morocco | Angle Rue Prince Moulay Abdellah et Rue Nakhla, Immeuble 1er étage G4, Apt 7, Casablanca |

E-mail: info@euraviafoods.com · NL mobile +31 6 59 14 57 53 · MA mobile +212 6 03 74 81 01

## 2. Sources

| File | What it gave us |
|---|---|
| `Website import & export.docx` | Menu, all product copy (19 products), the About text, contact details |
| `file.txt` | Earlier references: fruitqueen.nl, web.agro-trade.co |
| Client feedback (2026-10-11) | **"I like the design of moreco.ma/fr/"**, which is our own build (`../moreco/web`) |

What we keep from the references:
- **moreco.ma**: the whole look. Utility bar + hover-menu header, header transparent over a
  full-screen video hero then solid on scroll, numbered pillar cards, alternating
  image/text rows revealed on scroll, a stats band, a dark quote band flush with the footer,
  and a **quote basket** in the header.
- **agro-trade.co**: B2B content patterns. Category filter (fruit/veg/frozen), "why choose
  us", certifications, packing options, and a quote form that asks for quantity.
- **fruitqueen.nl**: timed out on fetch. We'll revisit it if the client points at something specific.

## 3. Goals (in priority order)

1. **Generate qualified B2B quote requests** from European importers and distributors.
2. Look **credible and established** next to Dutch and Spanish competitors. The Utrecht
   address is a selling point: European buyers deal with a European entity.
3. **Be found** for "Moroccan [product] supplier / exporter" style searches in EN, FR, NL.
4. Be cheap to host and easy to update (no CMS to patch, no server to maintain).

**Success metrics:** quote and contact submissions per month, organic impressions on
product queries (Google Search Console), Lighthouse ≥ 90 on every category.

## 4. Audiences

| Persona | Needs on the site | Language |
|---|---|---|
| Category buyer at an EU retailer or importer | Product range, origin, season window, certification, packaging, a fast way to ask for a price | EN, NL |
| Wholesaler / food-service buyer (FR, BE, MA) | Same, in French | FR |
| Food-industry buyer (IQF, sauces) | Frozen range, IQF process, year-round supply | EN |

## 5. Content inventory (from the .docx)

| Section | Items | Notes |
|---|---|---|
| Fresh: Vegetables | Tomatoes, Cherry tomato, Kapia pepper, California pepper, Chili peppers, Eggplant, Zucchini, Green beans | 8, copy present |
| Fresh: Fruits | Avocado, Citrus, Strawberry, Raspberry, Blueberry, Watermelon, Melon | 7. **Melon has no copy** |
| Frozen (IQF) | Strawberry, Blackberry, Raspberry, Blueberry | 4, copy present |
| Euravia (about) | Mission, global footprint (Morocco / Spain & Med), fresh + IQF promise | present |
| Blog | "Ajouter des photos agricoles" | **no articles** |
| Contact | 2 offices, mail, 2 mobiles | present |

Facts stated by the client that we can show: GlobalG.A.P. certification and full
traceability (eggplant copy), eggplant season **November → June**, cold chain kept above
10 °C for eggplant, Morocco as one of the world's **top five frozen-strawberry exporters**, IQF
freezing right after harvest, packing on the day of harvest (Morocco).

## 6. Gaps & risks

| # | Gap | Impact | What we do now |
|---|---|---|---|
| G1 | **No logo** | The palette can't come from the brand | Typographic "Euravia" wordmark + leaf mark in SVG, swappable in one file |
| G2 | **No photos at all** | A produce site without pictures doesn't sell | CC0 stock photos (Wikimedia/Unsplash archive) per product + CC0 hero film (Mixkit), all listed in `CREDITS.json`. Client photos replace them later |
| G3 | Melon copy missing | Empty product page | Neutral placeholder copy marked **[to validate]** |
| G4 | **No figures** (years, volumes, countries) | The moreco stats band relies on numbers | Use only true, stated facts: 2 offices, 19 products, 3 sourcing regions, IQF −18 °C. No invented numbers |
| G5 | Season calendar only for eggplant | Buyers look for availability | Show the season only where the client stated it; elsewhere say "Availability on request" |
| G6 | Certifications beyond GlobalG.A.P. unknown | Trust signal | Mention GlobalG.A.P. only (client's own words) |
| G7 | Blog empty | Thin section | 3 starter articles written from the client's own facts, **[to validate]** |
| G8 | Hosting & mailbox unknown | Forms can't send | PHP mailer (same as moreco). Until configured, the form reports a failure honestly and offers mail/WhatsApp |
| G9 | Legal pages (NL entity → GDPR) | Compliance | Privacy page from a standard template, **[to validate]** |
| G10 | "Imported tomatoes" wording in the source | Misleading: they are exported from Morocco | Rewritten as "Moroccan tomatoes" |

## 7. Assumptions (made so the build can start; each one is easy to reverse)

- **A1 Languages:** **English (default)**, French, Dutch. EN is the language of the source and
  of B2B produce trading; FR for Morocco, France and Belgium; NL for the Utrecht market.
- **A2 Domain:** `https://euraviafoods.com`.
- **A3 No prices, no online payment:** a request-for-quote catalogue, like moreco.
- **A4 Hosting:** a static host with PHP for the mail scripts (Hostinger/cPanel class),
  same as moreco. A Vercel preview is possible for the client review (forms off there).
- **A5 Menu:** the client's menu, kept exactly: Home · Fresh · Frozen · Euravia · Blog · Contact, plus the quote basket.

## 8. Questions for the client

1. Logo (SVG or high-resolution PNG) and any brand colours?
2. Own photos: fields, greenhouses, packing station, cold rooms, trucks, team?
3. Copy for **Melon**, and a season window per product (even rough: "Nov–May")?
4. Figures you're happy to publish: year founded, tonnes per year, countries served, number of partner growers?
5. Certifications held: GlobalG.A.P., BRCGS, IFS, SMETA, Organic…?
6. Packaging formats offered (cartons, punnets, bulk bins, IQF bag sizes)?
7. Confirm the languages EN / FR / NL. Is Spanish or German needed?
8. Who hosts euraviafoods.com, and which mailbox should receive the forms?
9. Company legal names and registration numbers for the footer (KvK for NL, RC/ICE for MA)?
10. Social media accounts, and WhatsApp on which number?
