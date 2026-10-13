'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import s from './HeroVideo.module.css';

/**
 * The bioworkseurope.com hero: a full-bleed muted video loop, a light dark wash, and any
 * text sliding up from behind a mask on load — their theme calls the two halves
 * `animation-cropper` / `animation-contents`.
 *
 * The poster carries the first paint (so the LCP is an image, not the video), and under
 * `prefers-reduced-motion` the video is never attached at all.
 *
 * Every text prop is optional. The home page passes none of them: the client's briefing
 * of 2026-09-09 took the title, the subtitle and the quote button off the film, leaving
 * the footage to play on its own. The wash stays — it is what keeps the header legible
 * over a bright frame.
 */
export interface HeroVideoProps {
  title?: string;
  subtitle?: string;
  /** Up to two buttons: the first solid (sun), the second outlined. */
  ctas?: { label: string; href: string }[];
  /** Small label over the title. */
  eyebrow?: string;
  poster: string;
  sources: { src: string; type: string }[];
  /** Credit line for CC0 footage, shown small in the corner. Own footage needs none. */
  credit?: string;
  /**
   * Burnt-in signature, bottom-left of the film (client briefing, 2026-09-13). It is a
   * caption on the footage, not a headline — it does not rise from a mask like the
   * title, and it is not the page's h1.
   */
  caption?: string;
}

export default function HeroVideo({ title, subtitle, ctas, eyebrow, poster, sources, credit, caption }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotion(!query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motion) return;
    // Some browsers refuse autoplay until the element is muted in the DOM, not just in JSX.
    video.muted = true;
    void video.play().catch(() => {
      /*
       * Autoplay blocked (iOS Low Power Mode, data saver): swap to the plain poster image,
       * otherwise the browser paints its own play button over the hero.
       */
      setMotion(false);
    });
  }, [motion]);

  const bare = !title && !subtitle && !ctas?.length;

  return (
    <section className={`${s.hero} ${bare ? s.bare : ''}`}>
      <div className={s.media}>
        {motion && sources.length > 0 ? (
          <video
            ref={videoRef}
            className={s.video}
            poster={poster}
            loop
            muted
            playsInline
            autoPlay
            controls={false}
            disablePictureInPicture
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          >
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={s.video} src={poster} alt="" aria-hidden="true" />
        )}
        <span className={s.wash} aria-hidden="true" />
      </div>

      {!bare && (
        <div className={`page ${s.inner}`}>
          {eyebrow && (
            <div className={s.cropper}>
              <p className={s.eyebrow}>{eyebrow}</p>
            </div>
          )}
          {title && (
            <div className={s.cropper} style={{ '--delay': '60ms' } as React.CSSProperties}>
              {/* Not the page's h1: the home page opens its text with that, as on moreco.ma. */}
              <p className={s.title}>{title}</p>
            </div>
          )}
          {subtitle && (
            <div className={s.cropper} style={{ '--delay': '120ms' } as React.CSSProperties}>
              <p className={s.subtitle}>{subtitle}</p>
            </div>
          )}
          {ctas && ctas.length > 0 && (
            <div className={s.cropper} style={{ '--delay': '240ms' } as React.CSSProperties}>
              <div className={s.ctas}>
                {ctas.map((cta, i) => (
                  <Link key={cta.href} className={`btn ${i === 0 ? 'btn--sun' : 'btn--inverse'}`} href={cta.href}>
                    {cta.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {caption && <p className={s.caption}>{caption}</p>}

      {credit && <p className={s.credit}>{credit}</p>}
    </section>
  );
}
