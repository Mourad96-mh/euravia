import Image from 'next/image';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { LOCALE_HREFLANG } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { ARTICLES } from '@/data/blog';
import { articleHref, href } from '@/data/routes';
import { breadcrumbs } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import Reveal from '@/components/Reveal/Reveal';
import JsonLd from '@/components/JsonLd/JsonLd';
import s from './BlogView.module.css';

export const formatDate = (iso: string, locale: Locale) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALE_HREFLANG[locale], { day: 'numeric', month: 'long', year: 'numeric' });

export default function BlogView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const crumbs = [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.blog.title }];
  const articles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <PageHeader title={t.blog.title} lead={t.blog.lead} crumbs={crumbs} crumbLabel={t.a11y.breadcrumb} />

      <section className="section">
        <div className="page">
          <ul className={s.grid}>
            {articles.map((article, i) => {
              const copy = article.copy[locale];
              const link = articleHref(locale, article.id);
              return (
                <li key={article.id} className={i === 0 ? s.first : undefined}>
                  <Reveal delay={i * 90} className={s.card}>
                    <div className={s.media}>
                      <Image src={article.image} alt="" width={1200} height={800} sizes="(min-width: 900px) 50vw, 100vw" className={s.img} priority={i === 0} />
                    </div>
                    <div className={s.body}>
                      <time className={s.date} dateTime={article.date}>
                        {formatDate(article.date, locale)}
                      </time>
                      <h2 className={s.title}>
                        <Link href={link}>{copy.title}</Link>
                      </h2>
                      <p className={s.excerpt}>{copy.excerpt}</p>
                      <span className={s.more} aria-hidden="true">
                        {t.blog.readMore} →
                      </span>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <QuoteBand locale={locale} />
    </>
  );
}
