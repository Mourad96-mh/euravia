# 07 — Delivery & launch plan

## Milestones

| # | Milestone | Content |
|---|---|---|
| M0 | Discovery & docs | This folder: requirements, architecture, IA, design system, SEO, QA |
| M1 | Foundation | Project scaffold, tokens, i18n, route table, header/footer, build script |
| M2 | Catalogue | Data + copy ×3 languages, hubs, category pages, product pages, photos |
| M3 | Brand pages | Home, Euravia, Blog (3 articles), Contact, Privacy |
| M4 | Conversion | Quote basket, quote + contact forms, PHP mailer |
| M5 | SEO & QA | JSON-LD, sitemap/robots/.htaccess, export checker, browser sweep, Lighthouse |
| M6 | Client review | Preview URL, the docs/CONTENT-TO-VALIDATE.md list, the questions from 01 §8 |
| M7 | Launch | Domain, hosting, mailbox, Search Console, GA4 (with consent) |

## Environments

- **Local:** `npm run dev` (forms fail by design, there's no PHP).
- **Build:** `powershell -ExecutionPolicy Bypass -File scripts/build.ps1` → `web/out/`.
- **Preview:** Vercel (static) for the client review. Forms are off there.
- **Production:** the euraviafoods.com host. Upload `out/` to the web root, then create
  `api/mail-config.php` from `mail-config.example.php` on the server.

## Launch checklist

- [ ] Logo + real photos swapped in, CREDITS.json updated
- [ ] Translations and `[to validate]` content approved by the client
- [ ] `mail-config.php` set; test a contact + a quote mail, check SPF/DKIM pass and not spam
- [ ] HTTPS, `www` → apex redirect (in `.htaccess`)
- [ ] Search Console: property, sitemap submitted, 3 hreflang sets inspected
- [ ] Analytics only with a consent banner (EU visitors, NL entity)
- [ ] Privacy page: legal names, KvK / RC numbers
- [ ] Own repository (not the Bureau-wide repo), README with how to edit content
