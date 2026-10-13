import { LOCALES, type Locale } from '@/i18n/config';
import { PRODUCTS, type CategoryKey } from './catalog';
import { ARTICLES } from './blog';
import words from './route-words.json';

/**
 * Every page of the site lives under `app/[locale]/[[...path]]`, resolved against the
 * table below. A static export cannot run middleware, so localised URLs are baked at
 * build time: /en/fresh/vegetables/, /fr/frais/legumes/, /nl/vers/groenten/.
 *
 * `key` names the same page across languages: the language switcher and hreflang use it.
 */
export type View =
  | 'home'
  | 'fresh'
  | 'category'
  | 'frozen'
  | 'product'
  | 'about'
  | 'blog'
  | 'article'
  | 'contact'
  | 'quote'
  | 'privacy';

export type WordKey = keyof typeof words;
export const WORDS = words as Record<WordKey, Record<Locale, string>>;

export interface RouteParams {
  category?: CategoryKey;
  product?: string;
  article?: string;
}

export interface Route {
  view: View;
  locale: Locale;
  /** Path segments after the locale, e.g. ['fresh', 'vegetables', 'tomatoes']. */
  path: string[];
  params: RouteParams;
  key: string;
}

const w = (k: WordKey, l: Locale) => WORDS[k][l];

/** Where a product sits: fresh ones under their sub-category, frozen ones under Frozen. */
function productBase(category: CategoryKey, locale: Locale): string[] {
  return category === 'frozen' ? [w('frozen', locale)] : [w('fresh', locale), w(category, locale)];
}

function routesFor(locale: Locale): Route[] {
  const out: Route[] = [];
  const add = (view: View, key: string, path: string[], params: RouteParams = {}) =>
    out.push({ view, locale, path, params, key });

  add('home', 'home', []);
  add('fresh', 'fresh', [w('fresh', locale)]);
  add('category', 'category:vegetables', [w('fresh', locale), w('vegetables', locale)], { category: 'vegetables' });
  add('category', 'category:fruits', [w('fresh', locale), w('fruits', locale)], { category: 'fruits' });
  add('frozen', 'frozen', [w('frozen', locale)], { category: 'frozen' });
  add('about', 'about', [w('about', locale)]);
  add('blog', 'blog', [w('blog', locale)]);
  add('contact', 'contact', [w('contact', locale)]);
  add('quote', 'quote', [w('quote', locale)]);
  add('privacy', 'privacy', [w('privacy', locale)]);

  for (const product of PRODUCTS) {
    add('product', `product:${product.id}`, [...productBase(product.category, locale), product.slugs[locale]], {
      category: product.category,
      product: product.id,
    });
  }

  for (const article of ARTICLES) {
    add('article', `article:${article.id}`, [w('blog', locale), article.slugs[locale]], { article: article.id });
  }

  return out;
}

export const ALL_ROUTES: Route[] = LOCALES.flatMap(routesFor);

const BY_PATH = new Map(ALL_ROUTES.map((r) => [`${r.locale}/${r.path.join('/')}`, r]));
const BY_KEY = new Map(ALL_ROUTES.map((r) => [`${r.locale}|${r.key}`, r]));

export function resolveRoute(locale: Locale, path: string[] = []): Route | undefined {
  return BY_PATH.get(`${locale}/${path.join('/')}`);
}

export const routeHref = (route: Route): string =>
  route.path.length ? `/${route.locale}/${route.path.join('/')}/` : `/${route.locale}/`;

export function href(locale: Locale, key: string): string {
  const route = BY_KEY.get(`${locale}|${key}`);
  return route ? routeHref(route) : `/${locale}/`;
}

/** The same page in every language — feeds the switcher and hreflang. */
export const translationsOf = (key: string) => LOCALES.map((locale) => ({ locale, href: href(locale, key) }));

export const productHref = (locale: Locale, id: string) => href(locale, `product:${id}`);
export const articleHref = (locale: Locale, id: string) => href(locale, `article:${id}`);
export const categoryHref = (locale: Locale, category: CategoryKey) =>
  category === 'frozen' ? href(locale, 'frozen') : href(locale, `category:${category}`);
