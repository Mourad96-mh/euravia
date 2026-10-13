# 05 — SEO & content plan

## Technical

- One `<title>` and meta description per page and per language. Title pattern
  `<Page> — Euravia`, home `Euravia — Fresh & frozen produce from Morocco`.
- `canonical` + `hreflang` en/fr/nl + `x-default` (→ en) on every page. The language
  switcher links to the exact sibling page.
- `sitemap.xml` with `xhtml:link` alternates, `robots.txt`, generated after the build by
  `scripts/finalize-export.mjs` from the built pages (so the sitemap can never list a page that
  doesn't exist).
- JSON-LD:
  - every page: `Organization` (name, url, logo, e-mail, both addresses as
    `PostalAddress`, `contactPoint` per office)
  - inner pages: `BreadcrumbList`
  - category pages: `ItemList` of the products
  - articles: `Article`
  - **No `Product` rich results**: Google requires price/offers or reviews, and we
    publish neither. Better no markup than invalid markup.
- Open Graph image per page (the page's own photo), `og:locale` per language.
- Static HTML, no client-side rendering of content, images sized (no CLS), hero poster
  as the LCP element.

## Keyword targets (per page, per language)

| Page | EN | FR | NL |
|---|---|---|---|
| Home | Moroccan fresh produce exporter | exportateur fruits et légumes Maroc | groente en fruit uit Marokko groothandel |
| Vegetables | Moroccan vegetables supplier | légumes du Maroc export | groenten uit Marokko |
| Tomatoes | Moroccan tomatoes supplier | tomates du Maroc export | tomaten uit Marokko |
| Cherry tomato | cherry tomatoes Morocco | tomates cerises Maroc | cherrytomaten Marokko |
| Peppers (×3) | Kapia / California / chili peppers Morocco | poivron Kapia / California, piment Maroc | Kapia paprika, puntpaprika… |
| Avocado | Moroccan avocado supplier | avocat du Maroc | avocado uit Marokko |
| Citrus | Moroccan citrus exporter | agrumes du Maroc export | citrusvruchten Marokko |
| Berries | Moroccan strawberries / blueberries / raspberries | fraises / myrtilles / framboises du Maroc | aardbeien / blauwe bessen uit Marokko |
| Frozen hub | IQF frozen fruit supplier Morocco | fruits surgelés IQF Maroc | IQF diepvriesfruit Marokko |
| IQF strawberries | IQF strawberries Morocco | fraises surgelées IQF Maroc | IQF aardbeien Marokko |

## Content rules

- **Never invent figures, certifications or claims.** Use only what the client wrote.
  Anything we had to write ourselves is tagged in `docs/CONTENT-TO-VALIDATE.md`.
- Product page = the client's paragraph (lightly edited for grammar) + highlights pulled out
  of that same paragraph as bullets + facts (origin, availability, certification, storage).
- FR and NL are our translations. The client reviews them.
- Blog starter articles (3), built from the client's own facts:
  1. *Why Morocco's early season matters to European buyers*
  2. *IQF explained: how frozen berries keep their fresh-picked quality*
  3. *Souss-Massa: inside Morocco's greenhouse heartland*
