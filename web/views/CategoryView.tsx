import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CATEGORY_ACCENT, CATEGORY_IMAGE, productName, productsIn, type CategoryKey } from '@/data/catalog';
import { href, productHref } from '@/data/routes';
import { breadcrumbs, itemList } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import NumberedPoints from '@/components/WhyMorocco/WhyMorocco';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import JsonLd from '@/components/JsonLd/JsonLd';

/**
 * One category: Fresh vegetables, Fresh fruit (both under Fresh), or Frozen, which is its
 * own menu entry and adds the "why IQF" points.
 */
export default function CategoryView({ locale, category }: { locale: Locale; category: CategoryKey }) {
  const t = getDictionary(locale);
  const products = productsIn(category);
  const frozen = category === 'frozen';

  const crumbs = frozen
    ? [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.frozen.title }]
    : [
        { label: t.nav.home, href: href(locale, 'home') },
        { label: t.fresh.title, href: href(locale, 'fresh') },
        { label: t.categories[category].name },
      ];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <JsonLd data={itemList(products.map((p) => ({ name: productName(p, locale), href: productHref(locale, p.id) })))} />
      <PageHeader
        title={frozen ? t.frozen.title : t.categories[category].name}
        lead={frozen ? t.frozen.lead : t.categories[category].blurb}
        crumbs={crumbs}
        crumbLabel={t.a11y.breadcrumb}
        image={CATEGORY_IMAGE[category]}
        accent={CATEGORY_ACCENT[category]}
      />

      <section className="section">
        <div className="page">
          <ProductGrid products={products} locale={locale} />
        </div>
      </section>

      {frozen ? (
        <NumberedPoints title={t.frozen.iqfTitle} points={t.frozen.iqfPoints} accent="var(--ice)" />
      ) : (
        <NumberedPoints title={t.why.title} points={t.why.points} />
      )}
      <QuoteBand locale={locale} />
    </>
  );
}
