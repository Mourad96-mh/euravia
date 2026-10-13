import type { Locale } from '@/i18n/config';
import en from './catalog/en.json';
import fr from './catalog/fr.json';
import nl from './catalog/nl.json';

/**
 * The catalogue: structure here, words in data/catalog/<locale>.json.
 *
 * The three categories map onto the client's menu: Fresh holds vegetables and fruits,
 * Frozen is its own entry. Each category has a colour, the way the four hexagons of the
 * moreco.ma logo each own a segment.
 */
export type CategoryKey = 'vegetables' | 'fruits' | 'frozen';

export const CATEGORIES: CategoryKey[] = ['vegetables', 'fruits', 'frozen'];
export const FRESH_CATEGORIES: CategoryKey[] = ['vegetables', 'fruits'];

export const CATEGORY_ACCENT: Record<CategoryKey, string> = {
  vegetables: 'var(--cat-veg)',
  fruits: 'var(--cat-fruit)',
  frozen: 'var(--cat-frozen)',
};

export interface Product {
  id: ProductId;
  category: CategoryKey;
  /** URL slug per language — buyers search "tomates du Maroc", not "tomatoes". */
  slugs: Record<Locale, string>;
  /**
   * Months the product ships, 1–12, only where the client stated it. Unknown seasons stay
   * undefined and the page says "availability on request" rather than guess.
   */
  season?: number[];
  /** Shown on the home page. */
  featured?: boolean;
}

export type ProductId = keyof typeof en;

export interface ProductCopy {
  name: string;
  tagline: string;
  intro: string;
  body: string[];
  highlights: string[];
  origin: string;
  availability?: string;
  certification?: string;
  storage?: string;
}

const COPY: Record<Locale, Record<ProductId, ProductCopy>> = { en, fr, nl };

const s = (en: string, fr: string, nl: string) => ({ en, fr, nl });

export const PRODUCTS: Product[] = [
  // Fresh — vegetables, in the client's order
  { id: 'tomatoes', category: 'vegetables', slugs: s('tomatoes', 'tomates', 'tomaten'), featured: true },
  { id: 'cherry-tomatoes', category: 'vegetables', slugs: s('cherry-tomatoes', 'tomates-cerises', 'cherrytomaten') },
  { id: 'kapia-pepper', category: 'vegetables', slugs: s('kapia-peppers', 'poivrons-kapia', 'kapia-paprika') },
  { id: 'california-pepper', category: 'vegetables', slugs: s('california-peppers', 'poivrons-california', 'blokpaprika') },
  { id: 'chili-peppers', category: 'vegetables', slugs: s('chili-peppers', 'piments', 'chilipepers') },
  /* The only product the client gave a season for: November to June. */
  { id: 'eggplant', category: 'vegetables', slugs: s('eggplants', 'aubergines', 'aubergines'), season: [11, 12, 1, 2, 3, 4, 5, 6] },
  { id: 'zucchini', category: 'vegetables', slugs: s('zucchini', 'courgettes', 'courgettes') },
  { id: 'green-beans', category: 'vegetables', slugs: s('green-beans', 'haricots-verts', 'sperziebonen') },

  // Fresh — fruits
  { id: 'avocado', category: 'fruits', slugs: s('avocados', 'avocats', 'avocados'), featured: true },
  { id: 'citrus', category: 'fruits', slugs: s('citrus', 'agrumes', 'citrusvruchten') },
  { id: 'strawberries', category: 'fruits', slugs: s('strawberries', 'fraises', 'aardbeien') },
  { id: 'raspberries', category: 'fruits', slugs: s('raspberries', 'framboises', 'frambozen') },
  { id: 'blueberries', category: 'fruits', slugs: s('blueberries', 'myrtilles', 'blauwe-bessen'), featured: true },
  { id: 'watermelon', category: 'fruits', slugs: s('watermelons', 'pasteques', 'watermeloenen') },
  { id: 'melon', category: 'fruits', slugs: s('melons', 'melons', 'meloenen') },

  // Frozen (IQF)
  { id: 'iqf-strawberries', category: 'frozen', slugs: s('iqf-strawberries', 'fraises-iqf', 'iqf-aardbeien'), featured: true },
  { id: 'iqf-blackberries', category: 'frozen', slugs: s('iqf-blackberries', 'mures-iqf', 'iqf-bramen') },
  { id: 'iqf-raspberries', category: 'frozen', slugs: s('iqf-raspberries', 'framboises-iqf', 'iqf-frambozen') },
  { id: 'iqf-blueberries', category: 'frozen', slugs: s('iqf-blueberries', 'myrtilles-iqf', 'iqf-blauwe-bessen') },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsIn = (category: CategoryKey) => PRODUCTS.filter((p) => p.category === category);
export const productCopy = (product: Product, locale: Locale): ProductCopy => COPY[locale][product.id];
export const productName = (product: Product, locale: Locale) => productCopy(product, locale).name;

/** One photo per product, named after its id (scripts/fetch-photos.mjs). */
export const productImage = (product: Product) => `/media/products/${product.id}.webp`;

/** Photographs for the three categories and the fresh hub. */
export const CATEGORY_IMAGE: Record<CategoryKey | 'fresh', string> = {
  fresh: '/media/scenes/fresh.webp',
  vegetables: '/media/scenes/vegetables.webp',
  fruits: '/media/scenes/fruits.webp',
  frozen: '/media/scenes/frozen.webp',
};

/** Related products: same category, without the product itself. */
export function relatedTo(product: Product, max = 4): Product[] {
  return productsIn(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, max);
}
