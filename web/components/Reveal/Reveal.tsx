'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Reveals its children the first time they scroll into view — the `data-aos` behaviour
 * bioworkseurope uses on its feature rows. Staggering comes from `delay`.
 *
 * The hiding half lives in globals.css under `html.js`, a class set by an inline script
 * in the layout: with JavaScript off nothing is ever hidden, and `prefers-reduced-motion`
 * skips the animation. So content can never be stuck invisible.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  threshold = 0.15,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    /*
     * `threshold` is a fraction of the element, so a block taller than the viewport can
     * never reach it and would sit at opacity 0 for good — that is what blanked the news
     * and about pages, each one article of some 7 000 px inside a single Reveal: 15 % of
     * it is 1 000 px, more than a laptop shows at once. Anything that tall reveals as
     * soon as it appears at all; the root margin below still keeps it from firing on a
     * sliver at the very bottom of the screen.
     */
    const ratio = node.offsetHeight > window.innerHeight ? 0 : threshold;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: ratio, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
