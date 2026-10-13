import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, LOCALE_HREFLANG, LOCALE_OG, SITE_URL, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { ALL_ROUTES, resolveRoute, translationsOf, type Route } from '@/data/routes';
import { CATEGORY_IMAGE, getProduct, productCopy, productImage } from '@/data/catalog';
import { getArticle } from '@/data/blog';

import HomeView from '@/views/HomeView';
import FreshView from '@/views/FreshView';
import CategoryView from '@/views/CategoryView';
import ProductView from '@/views/ProductView';
import AboutView from '@/views/AboutView';
import BlogView from '@/views/BlogView';
import ArticleView from '@/views/ArticleView';
import ContactView from '@/views/ContactView';
import QuoteView from '@/views/QuoteView';
import PrivacyView from '@/views/PrivacyView';

/**
 * Every page of the site is rendered from here. A static export cannot run middleware, so
 * localised URLs are baked at build time from the table in data/routes.ts.
 */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return ALL_ROUTES.filter((r) => r.locale === params.locale).map((r) => ({ path: r.path }));
}

interface Seo {
  title: string;
  description: string;
  image?: string;
  absolute?: boolean;
  noindex?: boolean;
}

function seoFor(route: Route, locale: Locale): Seo {
  const t = getDictionary(locale);

  switch (route.view) {
    case 'home':
      return { title: `${t.site.name} — ${t.site.tagline}`, description: t.site.description, absolute: true, image: '/media/hero/hero-poster.webp' };
    case 'fresh':
      return { title: t.fresh.title, description: t.fresh.lead, image: CATEGORY_IMAGE.fresh };
    case 'category': {
      const c = route.params.category as 'vegetables' | 'fruits';
      return { title: t.categories[c].name, description: t.categories[c].blurb, image: CATEGORY_IMAGE[c] };
    }
    case 'frozen':
      return { title: t.frozen.title, description: t.frozen.lead, image: CATEGORY_IMAGE.frozen };
    case 'product': {
      const product = getProduct(route.params.product!)!;
      const copy = productCopy(product, locale);
      return {
        title: t.catalog.seoTitle.replace('{name}', copy.name),
        description: `${copy.intro} ${copy.tagline}`,
        image: productImage(product),
      };
    }
    case 'about':
      return { title: t.about.title, description: t.about.lead, image: '/media/scenes/about.webp' };
    case 'blog':
      return { title: t.blog.title, description: t.blog.lead };
    case 'article': {
      const a = getArticle(route.params.article!)!;
      return { title: a.copy[locale].title, description: a.copy[locale].excerpt, image: a.image };
    }
    case 'contact':
      return { title: t.contact.title, description: t.contact.lead };
    case 'quote':
      // The basket is personal and empty for a crawler: not worth indexing.
      return { title: t.quote.title, description: t.quote.intro, noindex: true };
    case 'privacy':
      return { title: t.privacy.title, description: t.privacy.lead };
  }
}

export async function generateMetadata(props: PageProps<'/[locale]/[[...path]]'>): Promise<Metadata> {
  const { locale: raw, path } = await props.params;
  if (!isLocale(raw)) return {};
  const route = resolveRoute(raw, path ?? []);
  if (!route) return {};

  const seo = seoFor(route, raw);
  const alternates = translationsOf(route.key);
  const self = `${SITE_URL}${alternates.find((a) => a.locale === raw)!.href}`;

  return {
    title: seo.absolute ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: {
      canonical: self,
      languages: {
        ...Object.fromEntries(alternates.map(({ locale, href }) => [LOCALE_HREFLANG[locale], `${SITE_URL}${href}`])),
        'x-default': `${SITE_URL}${alternates.find((a) => a.locale === DEFAULT_LOCALE)!.href}`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: self,
      locale: LOCALE_OG[raw],
      ...(seo.image ? { images: [{ url: seo.image }] } : {}),
    },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page(props: PageProps<'/[locale]/[[...path]]'>) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const route = resolveRoute(locale, params.path ?? []);
  if (!route) notFound();

  switch (route.view) {
    case 'home':
      return <HomeView locale={locale} />;
    case 'fresh':
      return <FreshView locale={locale} />;
    case 'category':
    case 'frozen':
      return <CategoryView locale={locale} category={route.params.category!} />;
    case 'product':
      return <ProductView locale={locale} id={route.params.product!} />;
    case 'about':
      return <AboutView locale={locale} />;
    case 'blog':
      return <BlogView locale={locale} />;
    case 'article':
      return <ArticleView locale={locale} id={route.params.article!} />;
    case 'contact':
      return <ContactView locale={locale} />;
    case 'quote':
      return <QuoteView locale={locale} />;
    case 'privacy':
      return <PrivacyView locale={locale} />;
  }
}

/** Only the routes in the table exist; anything else is a 404 at build time. */
export const dynamicParams = false;
