import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CATEGORY_ACCENT, CATEGORY_IMAGE, FRESH_CATEGORIES, PRODUCTS, productName } from '@/data/catalog';
import { href, productHref } from '@/data/routes';
import { breadcrumbs, itemList } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import NumberedPoints from '@/components/WhyMorocco/WhyMorocco';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import JsonLd from '@/components/JsonLd/JsonLd';

/** The Fresh hub: vegetables and fruit together, with chips to narrow to one. */
export default function FreshView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const products = PRODUCTS.filter((p) => p.category !== 'frozen');
  const crumbs = [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.fresh.title }];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <JsonLd data={itemList(products.map((p) => ({ name: productName(p, locale), href: productHref(locale, p.id) })))} />
      <PageHeader
        title={t.fresh.title}
        lead={t.fresh.lead}
        crumbs={crumbs}
        crumbLabel={t.a11y.breadcrumb}
        image={CATEGORY_IMAGE.fresh}
      />

      <section className="section">
        <div className="page">
          <ProductGrid
            products={products}
            locale={locale}
            allLabel={t.catalog.filterAll}
            filters={FRESH_CATEGORIES.map((c) => ({
              key: c,
              label: t.categories[c].name,
              accent: CATEGORY_ACCENT[c],
            }))}
          />
        </div>
      </section>

      <NumberedPoints title={t.why.title} points={t.why.points} />
      <QuoteBand locale={locale} />
    </>
  );
}
