import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { locale as rootLocale } from 'next/root-params';
import { notFound } from 'next/navigation';

import '../globals.css';
import { LOCALES, LOCALE_HREFLANG, LOCALE_OG, SITE_URL, isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { organization } from '@/data/schema';
import { QuoteProvider } from '@/components/Quote/QuoteProvider';
import SiteHeader from '@/components/Header/SiteHeader';
import SiteFooter from '@/components/Footer/SiteFooter';
import JsonLd from '@/components/JsonLd/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

/**
 * `[locale]` sits above the root layout, which makes it a root param: server components
 * read it through `next/root-params`, and <html lang> is set here.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#1f6b3f',
};

export async function generateMetadata(): Promise<Metadata> {
  const value = await rootLocale();
  if (!value || !isLocale(value)) return {};
  const t = getDictionary(value);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${t.site.name} — ${t.site.tagline}`,
      template: `%s — ${t.site.name}`,
    },
    description: t.site.description,
    openGraph: {
      type: 'website',
      siteName: t.site.name,
      title: `${t.site.name} — ${t.site.tagline}`,
      description: t.site.description,
      locale: LOCALE_OG[value],
      images: [{ url: '/media/og.jpg', width: 1200, height: 630 }],
    },
    icons: { icon: '/favicon.svg' },
  };
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const value = await rootLocale();
  if (!value || !isLocale(value)) notFound();
  const locale = value as Locale;
  const t = getDictionary(locale);

  return (
    /*
     * suppressHydrationWarning: the inline script adds `js` to <html> before hydration on
     * purpose (rendering it server-side would hide reveal content from no-JS visitors),
     * and browser extensions write their own attributes on <body>.
     */
    <html lang={LOCALE_HREFLANG[locale]} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Arms the scroll-reveal styles — only where this script has run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={organization(locale, t.site.description)} />
      </head>
      <body suppressHydrationWarning>
        <QuoteProvider>
          <a className="skip-link" href="#main">
            {t.a11y.skipToContent}
          </a>
          <SiteHeader locale={locale} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} />
        </QuoteProvider>
      </body>
    </html>
  );
}
