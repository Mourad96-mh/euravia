import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import {
  CATEGORIES,
  CATEGORY_ACCENT,
  CATEGORY_IMAGE,
  PRODUCTS,
  productName,
  productsIn,
} from '@/data/catalog';
import { OFFICES } from '@/data/nav';
import { categoryHref, href, productHref } from '@/data/routes';
import HeroVideo from '@/components/Hero/HeroVideo';
import FeatureRow from '@/components/FeatureRow/FeatureRow';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import Reveal from '@/components/Reveal/Reveal';
import s from './HomeView.module.css';

/* Line pictograms at currentColor, one per pillar, in the dictionary's order. */
const PILLAR_ICONS = [
  /* Sun-ripened origin — a sun. */
  <svg key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
  </svg>,
  /* Early season — a calendar with a tick. */
  <svg key="season" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="m9 14.8 2 2 4-4.2" />
  </svg>,
  /* Cold chain — a snowflake. */
  <svg key="cold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6" />
    <path d="m9.5 4 2.5 2 2.5-2M9.5 20l2.5-2 2.5 2" />
  </svg>,
  /* Traceability — a shield with a tick. */
  <svg key="trace" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.5s7.5-3.2 7.5-9.5V5.2L12 2.5 4.5 5.2V12c0 6.3 7.5 9.5 7.5 9.5Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </svg>,
  /* Two offices — a route between two pins. */
  <svg key="route" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8" />
  </svg>,
];

const FACT_ICONS = [
  /* Products — a crate. */
  <svg key="range" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M3 9h18l-1.6 10.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8Z" />
    <path d="M8 9a4 4 0 0 1 8 0M9 13v4M15 13v4M12 13v4" />
  </svg>,
  /* Offices — a building. */
  <svg key="offices" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M4 21V5.5L13 3v18M13 8.5l7 2V21M2.5 21h19" />
    <path d="M7.5 8h2M7.5 12h2M7.5 16h2M16 13.5h1.5M16 17h1.5" />
  </svg>,
  /* Sourcing areas — a globe. */
  <svg key="areas" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3Z" />
  </svg>,
  /* IQF — a thermometer. */
  <svg key="iqf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M10 4a2 2 0 0 1 4 0v10.3a4 4 0 1 1-4 0Z" />
    <path d="M12 9v7M16.5 6h2.5M16.5 9.5h2.5" />
  </svg>,
];

export default function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <>
      <HeroVideo
        eyebrow={t.site.tagline}
        title={t.home.heroTitle}
        subtitle={t.home.heroText}
        ctas={[
          { label: t.home.heroPrimary, href: href(locale, 'fresh') },
          { label: t.home.heroSecondary, href: href(locale, 'quote') },
        ]}
        poster="/media/hero/hero-poster.webp"
        sources={[{ src: '/media/hero/hero.mp4', type: 'video/mp4' }]}
      />

      {/* The moreco.ma intro: brand as eyebrow over the h1, lead beside its supporting
          paragraphs, then the numbered pillars. */}
      <section className={`section ${s.intro}`}>
        <div className="page">
          <Reveal>
            <header className={s.introHead}>
              <p className={s.introEyebrow}>{t.home.eyebrow}</p>
              <h1 className={s.introTitle}>{t.home.title}</h1>
            </header>
          </Reveal>

          <div className={s.introBody}>
            <Reveal delay={80}>
              <p className={s.introLead}>{t.home.lead}</p>
            </Reveal>
            <Reveal delay={160} className={s.introAside}>
              {t.home.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </Reveal>
          </div>

          <Reveal>
            <h2 className={s.pillarsTitle}>{t.home.pillarsTitle}</h2>
          </Reveal>
          <ol className={s.pillars}>
            {t.home.pillars.map((pillar, i) => (
              <li key={pillar.title} className={s.pillar}>
                <Reveal delay={i * 70} className={s.pillarInner}>
                  <span className={s.pillarHead} aria-hidden="true">
                    <span className={s.pillarIcon}>{PILLAR_ICONS[i]}</span>
                    <span className={s.pillarNumber}>{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <strong className={s.pillarTitle}>{pillar.title}</strong>
                  <span className={s.pillarText}>{pillar.text}</span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The three ranges as the alternating rows of moreco.ma, each in its category colour. */}
      <section className="section section--tint" id="ranges">
        <div className="page">
          <Reveal>
            <h2 className={s.sectionTitle}>{t.home.rangesTitle}</h2>
          </Reveal>
          {CATEGORIES.map((category, i) => (
            <FeatureRow
              key={category}
              index={i}
              eyebrow={`${productsIn(category).length} ${t.catalog.count.other}`}
              title={t.categories[category].name}
              body={<p>{t.categories[category].blurb}</p>}
              image={CATEGORY_IMAGE[category]}
              imageAlt={t.categories[category].name}
              accent={CATEGORY_ACCENT[category]}
              aside={
                <ul className={s.tags}>
                  {productsIn(category).map((p) => (
                    <li key={p.id}>
                      <Link href={productHref(locale, p.id)}>{productName(p, locale)}</Link>
                    </li>
                  ))}
                </ul>
              }
              link={{ label: t.catalog.seeRange, href: categoryHref(locale, category) }}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="page">
          <Reveal className="section-head">
            <h2>{t.home.featuredTitle}</h2>
            <p>{t.home.featuredLead}</p>
          </Reveal>
          <ProductGrid products={featured} locale={locale} />
        </div>
      </section>

      {/* Two offices, one chain: Casablanca at the source, Utrecht by the customer. */}
      <section className={`section ${s.offices}`}>
        <div className={`page ${s.officesInner}`}>
          <Reveal className={s.officesText}>
            <h2>{t.home.officesTitle}</h2>
            <p>{t.home.officesText}</p>
            <Link className="btn btn--inverse" href={href(locale, 'contact')}>
              {t.nav.contact}
            </Link>
          </Reveal>
          <ol className={s.route}>
            {[...OFFICES].reverse().map((office, i) => (
              <li key={office.key} className={s.stop}>
                <Reveal delay={i * 140} className={s.stopInner}>
                  <span className={s.stopFlag}>{office.key.toUpperCase()}</span>
                  <span className={s.stopCity}>{office.city}</span>
                  <span className={s.stopRole}>{t.offices[office.key].role}</span>
                  <a className={s.stopPhone} href={office.phone.href}>
                    {office.phone.label}
                  </a>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Facts band — only true, stated figures (docs/01-discovery.md, G4). */}
      <section className="section">
        <div className="page">
          <div className={s.stats}>
            {t.home.facts.map((fact, i) => (
              <Reveal key={fact.label} className={s.stat} delay={i * 110}>
                <span className={s.statIcon} aria-hidden="true">
                  {FACT_ICONS[i]}
                </span>
                <p className={s.statNumber}>{fact.value}</p>
                <p className={s.statLabel}>{fact.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand locale={locale} />
    </>
  );
}
