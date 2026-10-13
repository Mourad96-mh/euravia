import type { Locale } from '@/i18n/config';
import type { Product } from '@/data/catalog';
import ProductCard from '@/components/ProductCard/ProductCard';
import FilteredGrid from './FilteredGrid';
import s from './ProductGrid.module.css';

/**
 * The card grid. With `filters`, chips above it narrow the list by category; every card is
 * still rendered on the server, so nothing depends on JavaScript.
 */
export default function ProductGrid({
  products,
  locale,
  filters,
  allLabel = '',
}: {
  products: Product[];
  locale: Locale;
  filters?: { key: string; label: string; accent: string }[];
  allLabel?: string;
}) {
  const cards = products.map((product, i) => (
    <ProductCard key={product.id} product={product} locale={locale} priority={i < 4} />
  ));

  if (filters) {
    return (
      <FilteredGrid filters={filters} allLabel={allLabel} keys={products.map((p) => p.category)}>
        {cards}
      </FilteredGrid>
    );
  }

  return (
    <ul className={s.grid}>
      {cards.map((card, i) => (
        <li key={products[i].id}>{card}</li>
      ))}
    </ul>
  );
}
