# 06 — Quality plan (definition of done)

## Budgets

| Metric | Budget |
|---|---|
| Lighthouse (mobile) Performance / A11y / Best practices / SEO | ≥ 90 / ≥ 95 / ≥ 95 / 100 |
| LCP (4G mobile) | < 2.5 s, with the hero poster ≤ 150 KB |
| CLS | < 0.05 (every image has width/height) |
| Hero film | ≤ 4 MB, H.264, muted, 720p/1080p, ≤ 15 s loop |
| Product photo | ≤ 120 KB WebP at 1200 px |
| JS on a content page | Only the header, reveal and quote islands are client components |

## Automated checks (run on every build)

1. `tsc --noEmit`, strict. A missing FR/NL key fails the build (dictionary typed from EN).
2. `next build` exports every route in the table, so a route that doesn't render fails.
3. `scripts/check-export.mjs`:
   - every page has exactly one `<h1>`, a `<title>`, a meta description, a canonical, 4 hreflang links
   - every internal `href` resolves to a built file (no dead links)
   - every `<img src>` exists in `out/`
   - no English UI strings leaking into `/fr/` or `/nl/` (spot list)
   - every product appears in the sitemap in 3 languages

## Manual / browser checks (Edge via Playwright)

| Check | How |
|---|---|
| Responsive at 360, 390, 768, 1024, 1280, 1440, 1920 | screenshot + `scrollWidth > clientWidth` overflow probe |
| Header: transparent over the hero, solid on scroll, mega panel geometry, hover bridge | measure rects (panels lay out even when hidden) |
| Mobile drawer opens/closes, focus visible, Escape closes | `elementFromPoint` on the burger, keyboard |
| Quote basket: add from card + product page, badge count, quantity/unit, persists on reload, clear | scripted clicks |
| Forms: required fields, whitespace-only rejected, honest failure without PHP | scripted submit |
| Reduced motion: no animation, content visible | emulate `prefers-reduced-motion` |
| No-JS: all content visible | run without the `js` class |
| Language switcher keeps you on the same page | click EN→FR→NL on a product |

## Acceptance criteria (client-facing)

- [ ] All 19 products online in EN/FR/NL with a photo
- [ ] Menu exactly as briefed: Home · Fresh · Frozen · Euravia · Blog · Contact
- [ ] Quote basket works end to end (with PHP mail once the host is set)
- [ ] Both offices and phones visible in the header/footer/contact
- [ ] The design matches moreco.ma (header, video hero, pillars, rows, stats, quote band)
- [ ] Lighthouse budgets met on Home, a category page and a product page
