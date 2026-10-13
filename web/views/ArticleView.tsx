import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { getArticle } from '@/data/blog';
import { getProduct, type Product } from '@/data/catalog';
import { articleHref, href } from '@/data/routes';
import { article as articleSchema, breadcrumbs } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import JsonLd from '@/components/JsonLd/JsonLd';
import { formatDate } from './BlogView';
import shared from './Shared.module.css';
import s from './BlogView.module.css';

export default function ArticleView({ locale, id }: { locale: Locale; id: string }) {
  const article = getArticle(id);
  if (!article) notFound();

  const t = getDictionary(locale);
  const copy = article.copy[locale];
  const crumbs = [
    { label: t.nav.home, href: href(locale, 'home') },
    { label: t.blog.title, href: href(locale, 'blog') },
    { label: copy.title },
  ];
  const related = article.related.map((pid) => getProduct(pid)).filter((p): p is Product => !!p);

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <JsonLd
        data={articleSchema({
          title: copy.title,
          description: copy.excerpt,
          date: article.date,
          image: article.image,
          href: articleHref(locale, article.id),
        })}
      />
      <PageHeader
        eyebrow={formatDate(article.date, locale)}
        title={copy.title}
        lead={copy.excerpt}
        crumbs={crumbs}
        crumbLabel={t.a11y.breadcrumb}
        image={article.image}
      />

      <article className="section">
        <div className={`page-narrow ${shared.prose}`}>
          {copy.body.map((block, i) =>
            typeof block === 'string' ? <p key={i}>{block}</p> : <h2 key={i}>{block.h}</h2>
          )}
          <p>
            <Link href={href(locale, 'blog')} className={s.more}>
              ← {t.blog.back}
            </Link>
          </p>
        </div>
      </article>

      <section className="section section--tint">
        <div className="page">
          <div className="section-head">
            <h2>{t.blog.related}</h2>
          </div>
          <ProductGrid products={related} locale={locale} />
        </div>
      </section>

      <QuoteBand locale={locale} />
    </>
  );
}
