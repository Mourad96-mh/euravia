'use client';

import { Children, useState, type ReactNode } from 'react';
import s from './ProductGrid.module.css';

/**
 * Filter chips over server-rendered cards (Fresh hub: All / Vegetables / Fruits). The
 * default is "all", so the full list shows before any click, with JavaScript off, and to
 * crawlers. A chip only hides cards; it never fetches or re-renders them.
 */
export default function FilteredGrid({
  filters,
  allLabel,
  keys,
  children,
}: {
  filters: { key: string; label: string; accent: string }[];
  allLabel: string;
  /** The filter key of each child, in order. */
  keys: string[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const items = Children.toArray(children);
  const count = (key: string | null) => (key ? keys.filter((k) => k === key).length : keys.length);

  return (
    <>
      <div className={s.chips} role="group">
        <button type="button" className={s.chip} aria-pressed={active === null} onClick={() => setActive(null)}>
          {allLabel} <span className={s.chipCount}>{count(null)}</span>
        </button>
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={s.chip}
            style={{ '--accent': f.accent } as React.CSSProperties}
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
          >
            {f.label} <span className={s.chipCount}>{count(f.key)}</span>
          </button>
        ))}
      </div>
      <ul className={s.grid}>
        {items.map((child, i) => (
          <li key={i} className={active && keys[i] !== active ? s.hidden : undefined}>
            {child}
          </li>
        ))}
      </ul>
    </>
  );
}
