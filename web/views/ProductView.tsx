import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CATEGORY_ACCENT, getProduct, productCopy, productImage, relatedTo } from '@/data/catalog';
import { categoryHref, href } from '@/data/routes';
import { breadcrumbs } from '@/data/schema';
import AddToQuote from '@/components/Quote/AddToQuote';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import SeasonBar from '@/components/SeasonBar/SeasonBar';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import Reveal from '@/components/Reveal/Reveal';
import JsonLd from '@/components/JsonLd/JsonLd';
import s from './ProductView.module.css';

export default function ProductView({ locale, id }: { locale: Locale; id: string }) {
  const product = getProduct(id);
  if (!product) notFound();

  const t = getDictionary(locale);
  const copy = productCopy(product, locale);
  const frozen = product.category === 'frozen';
  const category = t.categories[product.category];

  const crumbs = [
    { label: t.nav.home, href: href(locale, 'home') },
    frozen
      ? { label: t.frozen.title, href: href(locale, 'frozen') }
      : { label: t.fresh.title, href: href(locale, 'fresh') },
    ...(frozen ? [] : [{ label: category.name, href: categoryHref(locale, product.category) }]),
    { label: copy.name },
  ];

  const facts: { label: string; value: string }[] = [
    { label: t.catalog.origin, value: copy.origin },
    { label: t.catalog.availability, value: copy.availability ?? t.catalog.onRequest },
    ...(copy.certification ? [{ label: t.catalog.certification, value: copy.certification }] : []),
    ...(copy.storage ? [{ label: t.catalog.storage, value: copy.storage }] : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />

      <section className={s.top} style={{ '--accent': CATEGORY_ACCENT[product.category] } as React.CSSProperties}>
        <div className="page">
          <nav aria-label={t.a11y.breadcrumb} className={s.crumbs}>
            <ol>
              {crumbs.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>

          <div className={s.grid}>
            <figure className={s.figure}>
              <Image
                src={productImage(product)}
                alt={copy.name}
                width={1200}
                height={900}
                sizes="(min-width: 900px) 640px, 100vw"
                priority
                className={s.img}
              />
            </figure>

            <div className={s.summary}>
              <p className={s.category}>{category.name}</p>
              <h1 className={s.title}>{copy.name}</h1>
              <p className={s.tagline}>{copy.tagline}</p>

              <dl className={s.facts}>
                {facts.map((fact) => (
                  <div key={fact.label} className={s.fact}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className={s.actions}>
                <AddToQuote slug={product.id} labels={{ add: t.catalog.addToQuote, inQuote: t.catalog.inQuote }} />
                <Link className="btn btn--ghost" href={href(locale, 'quote')}>
                  {t.nav.quote}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ '--accent': CATEGORY_ACCENT[product.category] } as React.CSSProperties}>
        <div className={`page ${s.details}`}>
          <Reveal className={s.text}>
            <p className={s.intro}>{copy.intro}</p>
            {copy.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal delay={120} className={s.side}>
            <h2 className={s.sideTitle}>{t.catalog.highlights}</h2>
            <ul className={s.checks}>
              {copy.highlights.map((h) => (
                <li key={h}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
                    <path d="m4 12.5 5.2 5.2L20 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>

            {product.season && (
              <div className={s.season}>
                <SeasonBar
                  months={product.season}
                  initials={t.catalog.months}
                  names={t.catalog.monthNames}
                  title={t.catalog.season}
                  inSeason={t.catalog.inSeason}
                />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="page">
          <Reveal className="section-head">
            <h2>{t.catalog.related}</h2>
          </Reveal>
          <ProductGrid products={relatedTo(product)} locale={locale} />
        </div>
      </section>

      <QuoteBand locale={locale} title={t.catalog.askTitle} text={t.catalog.askText} />
    </>
  );
}
