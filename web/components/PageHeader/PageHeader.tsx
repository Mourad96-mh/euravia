import Image from 'next/image';
import Link from 'next/link';
import s from './PageHeader.module.css';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The banner every interior page opens with. It also carries the breadcrumb, which the
 * deep catalogue (segment → range → product) needs to stay navigable.
 *
 * With `image` it becomes the interior-page counterpart of the home page's video hero:
 * the photograph fills the band, a wash keeps the type legible, and the whole block
 * flips to light-on-dark. Without one it stays the quiet grey band it was.
 */
export default function PageHeader({
  title,
  lead,
  eyebrow,
  crumbs,
  crumbLabel,
  accent,
  image,
  intro,
}: {
  title: string;
  lead?: string;
  /**
   * A short titled text in place of the one-line lead — Agriculture's "Exclusive
   * Stabilized OSA Technology" (briefing of 2026-09-27, step 3). Wins over `lead`.
   */
  intro?: { title: string; paragraphs: string[] };
  eyebrow?: string;
  crumbs?: Crumb[];
  crumbLabel: string;
  accent?: string;
  /** Background photograph, from data/hero-images.ts. */
  image?: string;
}) {
  return (
    <header
      className={`${s.header} ${image ? s.onImage : ''}`}
      style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}
    >
      {image && (
        <div className={s.media} aria-hidden="true">
          {/* The banner is the largest paint on an interior page, so it loads eagerly. */}
          <Image src={image} alt="" fill priority sizes="100vw" className={s.img} />
          <span className={s.wash} />
        </div>
      )}

      <div className={`page ${s.inner}`}>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label={crumbLabel} className={s.crumbs}>
            <ol>
              {crumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`}>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <h1 className={s.title}>{title}</h1>
        {intro ? (
          <div className={s.intro}>
            <h2 className={s.introTitle}>{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className={s.introText}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          lead && <p className={s.lead}>{lead}</p>
        )}
      </div>
    </header>
  );
}
