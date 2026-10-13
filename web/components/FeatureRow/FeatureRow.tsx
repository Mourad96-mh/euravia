import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import Reveal from '@/components/Reveal/Reveal';
import s from './FeatureRow.module.css';

/**
 * The alternating image + text row moreco.ma took from bioworkseurope.com: the photo fades
 * in, then the label, heading, body and link follow on a stagger as the row enters the
 * viewport. Consecutive rows flip sides on their own through `index`.
 *
 * Euravia's rows always carry a landscape photograph, so the picture sits in a fixed 3:2
 * frame (moreco needed per-image sizing for its cut-outs and charts; this site does not).
 */
export interface FeatureRowProps {
  title: string;
  eyebrow?: string;
  body?: ReactNode;
  image: string;
  imageAlt: string;
  index?: number;
  link?: { label: string; href: string };
  accent?: string;
  /** A small list under the body — e.g. the products of a range. */
  aside?: ReactNode;
}

export default function FeatureRow({ title, eyebrow, body, image, imageAlt, index = 0, link, accent, aside }: FeatureRowProps) {
  const flipped = index % 2 === 1;

  return (
    <div
      className={`${s.row} ${flipped ? s.flipped : ''}`}
      style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}
    >
      <Reveal className={s.media}>
        <figure className={s.figure}>
          <Image
            src={image}
            alt={imageAlt}
            width={1200}
            height={800}
            sizes="(min-width: 860px) 640px, 100vw"
            className={s.img}
          />
        </figure>
      </Reveal>

      <div className={s.text}>
        {eyebrow && (
          <Reveal delay={80}>
            <p className={s.eyebrow}>{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={140}>
          <h3 className={s.title}>{title}</h3>
        </Reveal>
        {body && (
          <Reveal delay={220}>
            <div className={s.body}>{body}</div>
          </Reveal>
        )}
        {aside && <Reveal delay={260}>{aside}</Reveal>}
        {link && (
          <Reveal delay={300}>
            <Link className={s.link} href={link.href}>
              {link.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        )}
      </div>
    </div>
  );
}
