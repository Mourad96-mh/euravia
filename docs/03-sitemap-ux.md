# 03 — Information architecture & page plans

## Navigation (the client's menu, unchanged)

```
[utility bar]  socials · ☎ NL +31… · ☎ MA +212…                    EN FR NL
[main bar]     EURAVIA   Home  Fresh▾  Frozen▾  Euravia  Blog  Contact   [🛒 Quote request (n)]
```

- **Fresh ▾** = mega panel: two columns, *Vegetables* (8) and *Fruits* (7), each product a
  link, plus an "All fresh produce →" footer row. Column colours: vegetables green,
  fruits orange.
- **Frozen ▾** = dropdown: the 4 IQF products + "All frozen fruit".
- Mobile: burger → drawer with the same tree, the quote button, both phones, languages.

## URL map

| Page | EN | FR | NL |
|---|---|---|---|
| Home | `/en/` | `/fr/` | `/nl/` |
| Fresh (hub) | `/en/fresh/` | `/fr/frais/` | `/nl/vers/` |
| Vegetables | `/en/fresh/vegetables/` | `/fr/frais/legumes/` | `/nl/vers/groenten/` |
| Fruits | `/en/fresh/fruits/` | `/fr/frais/fruits/` | `/nl/vers/fruit/` |
| Fresh product | `/en/fresh/vegetables/tomatoes/` | `/fr/frais/legumes/tomates/` | `/nl/vers/groenten/tomaten/` |
| Frozen (hub) | `/en/frozen/` | `/fr/surgeles/` | `/nl/diepvries/` |
| Frozen product | `/en/frozen/iqf-strawberries/` | `/fr/surgeles/fraises-iqf/` | `/nl/diepvries/iqf-aardbeien/` |
| About | `/en/euravia/` | `/fr/euravia/` | `/nl/euravia/` |
| Blog | `/en/blog/` | `/fr/blog/` | `/nl/blog/` |
| Article | `/en/blog/<slug>/` | … | … |
| Contact | `/en/contact/` | `/fr/contact/` | `/nl/contact/` |
| Quote basket | `/en/quote/` | `/fr/devis/` | `/nl/offerte/` |
| Privacy | `/en/privacy/` | `/fr/confidentialite/` | `/nl/privacy/` |

That's 19 products + 13 fixed pages + 3 articles = 35 pages per language, about **105 pages** in total.

## Page plans

### Home (the moreco.ma structure, adapted)
1. **Full-screen video hero** (100svh): farm footage, a moderate 2–3 line title, one
   sentence, two buttons (*Explore fresh produce* / *Request a quote*). The header floats
   over it and turns solid on scroll.
2. **Intro**: eyebrow "EURAVIA", the H1 (the hero title becomes a visual, the H1 sits here as
   on moreco), the lead + two supporting paragraphs from the About text.
3. **5 numbered pillars (01–05)**: Sun-ripened Moroccan origin · Early-season advantage ·
   Cold chain & IQF · Traceability & GlobalG.A.P. · Morocco-to-Europe logistics.
4. **Our ranges**: 3 alternating image/text rows (Fresh vegetables, Fresh fruits,
   Frozen IQF fruit), each with "See the range →".
5. **Featured products**: a 4-card grid (tomato, avocado, blueberry, IQF strawberry) with
   add-to-quote.
6. **Two offices band**: Utrecht ↔ Casablanca. The bridge between Moroccan growers and EU buyers.
7. **Facts band** (true facts only): 19 products · 2 offices · 3 sourcing regions · −18 °C IQF.
8. **Quote band**, dark, flush with the footer.

### Fresh hub / Vegetables / Fruits / Frozen hub
Photo page header + breadcrumb → short intro → **filter chips** (All / Vegetables / Fruits
on the Fresh hub) → product card grid (photo, name, one-line claim, *Add to quote*,
*Details*) → "why Moroccan" strip → quote band.

### Product page
Breadcrumb → two columns: **photo** | name, category chip, tagline, *Add to quote* +
quantity, key facts (origin, availability, certification, storage). Then the description,
**highlights** as a check list, **season bar** (12 months, only when known; otherwise
"availability on request") → related products (same category) → quote band.

### Euravia (about)
Photo header → mission text → **global footprint**: two cards (Morocco / Spain &
Mediterranean) → fresh vs IQF promise → two offices with addresses → quote band.

### Blog
Grid of article cards (photo, date, title, excerpt) → article page (header photo,
reading width ~70ch, related products).

### Contact
Two office cards (address, phone, mail, map link) + the contact form (subject, name,
company, e-mail, phone, country, message) + WhatsApp link.

### Quote
The basket (lines with quantity + unit), plus the form: name, company, e-mail, phone, country,
destination, desired period, message.

## Shared components

| Component | From moreco | Change |
|---|---|---|
| Header (utility bar, mega/dropdown, drawer, quote button) | yes | two phones, new logo, Fresh mega = product lists |
| HeroVideo | yes | the title/subtitle/CTA are used this time |
| Reveal, FeatureRow, PageHeader, Footer | yes | restyled tokens |
| QuoteProvider, AddToQuote, QuoteForm | yes | unit selector + B2B fields |
| ContactForm | rewritten | simpler subject list |
| ProductCard, FilterChips, SeasonBar, FactsList | new | |
