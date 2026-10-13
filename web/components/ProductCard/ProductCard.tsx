import Image from 'next/image';
import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CATEGORY_ACCENT, productCopy, productImage, type Product } from '@/data/catalog';
import { productHref } from '@/data/routes';
import AddToQuote from '@/components/Quote/AddToQuote';
import s from './ProductCard.module.css';

/**
 * A catalogue tile: photo, category, name, the one-line claim, and the two actions a buyer
 * takes from a list — put it in the quote, or read the sheet.
 */
export default function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  const t = getDictionary(locale);
  const copy = productCopy(product, locale);
  const link = productHref(locale, product.id);

  return (
    <article className={s.card} style={{ '--accent': CATEGORY_ACCENT[product.category] } as React.CSSProperties}>
      <div className={s.media}>
        <Image
          src={productImage(product)}
          alt=""
          width={800}
          height={600}
          sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 100vw"
          className={s.img}
          priority={priority}
        />
      </div>
      <div className={s.body}>
        <p className={s.category}>{t.categories[product.category].name}</p>
        <h3 className={s.title}>
          <Link href={link}>{copy.name}</Link>
        </h3>
        <p className={s.tagline}>{copy.tagline}</p>
        <div className={s.actions}>
          <AddToQuote
            slug={product.id}
            size="small"
            labels={{ add: t.catalog.addToQuote, inQuote: t.catalog.inQuote }}
          />
          <span className={s.more} aria-hidden="true">
            {t.catalog.details}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
