# 04 — Design system

Based on moreco.ma (the client's reference). Same layout grammar, spacing scale, motion
and components, recoloured for a fresh-produce trader. There's no logo yet, so the
palette comes from the products themselves and is set up to be re-tuned the day a logo
arrives (every colour is a token in `app/globals.css`).

## Colour

| Token | Hex | Use |
|---|---|---|
| `--brand` | `#1F6B3F` | Primary: leaf green. Buttons, links, eyebrows |
| `--brand-dark` | `#17532F` | Hover, text on light tints (contrast 8.9:1 on white) |
| `--brand-darker` | `#0F3A21` | Hero fallback, quote band, intro close panel |
| `--sun` | `#E9792B` | Accent: citrus/sun. Badges, highlights, the fruits category |
| `--sun-dark` | `#B4561A` | Accent text on white (4.9:1) |
| `--ice` | `#2A78B5` | Frozen/IQF category, focus ring |
| `--cat-veg` / `--cat-fruit` / `--cat-frozen` | brand / sun / ice | Category identity, as the four logo hexagons were on moreco |
| `--ink` / `--ink-2` / `--ink-3` | `#13201A` / `#3D4A43` / `#66736C` | Text |
| `--paper` / `--paper-2` / `--paper-3` | `#FFFFFF` / `#F6F7F2` / `#EDF0E8` | Surfaces (warm off-white) |
| `--line` / `--line-strong` | `#E2E6DF` / `#CBD3C8` | Borders |
| Footer | `#0C1712` | Dark base the quote band fades into |

All text pairs are checked at **WCAG AA** (4.5:1 body, 3:1 large text).

## Type

Inter (400/500/600/700), the same as moreco. Fluid scale (`clamp`), `--step--1` 0.83→0.89 rem …
`--step-5` 2.5→4 rem. Headings: weight 700, tracking −0.02em, `text-wrap: balance`.
**Hero title capped at ~3 lines / ≤ 72 px** (user preference). Body 1–1.09 rem, line height 1.6.

## Space & layout

`--gutter` clamp(1.15→2 rem), page width 1320 px, narrow 780 px, section padding
clamp(3→6 rem). Radius 4 px (buttons), 10 px (cards). Header 38 px utility bar + 88/68 px
main bar.

## Motion

Scroll reveal (opacity + 22 px rise, 0.7 s, staggered 70–110 ms). Hero text rises from a
mask. Header shrinks on scroll. All of it is disabled under `prefers-reduced-motion`. The reveal
only hides content when JS has run (`html.js`), so a no-JS visitor never gets a blank page.

## Imagery rules

- Landscape crops (3:2 / 16:9), at most ~50 vh tall, never portrait crops of landscape
  photos.
- Product photos 4:3, `object-fit: cover`, on `--paper-2` while loading.
- Stock photos are slightly desaturated (`saturate(.95)`) so mixed sources read as one set.
- No pause button on the hero video, and no giant wordmark in the footer (user preferences).

## Components (states to verify)

Buttons (primary, ghost, inverse on photo) · nav link (hover underline, current) · mega
and dropdown panels (open/closed, keyboard focus) · product card (hover lift, in-quote
state) · filter chip (pressed) · form field (focus, invalid, disabled) · alert
(success/error) · season bar (in season / off / unknown).
