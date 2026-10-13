import { SITE_URL, type Locale } from '@/i18n/config';
import { CONTACT, OFFICES } from './nav';

/**
 * JSON-LD builders (docs/05-seo-content.md). No `Product` markup: Google wants price,
 * offers or reviews for it, and the site publishes none of them.
 */
export function organization(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: CONTACT.company,
    url: `${SITE_URL}/${locale}/`,
    logo: `${SITE_URL}/media/brand/euravia-logo.png`,
    email: CONTACT.email,
    description,
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Mississippidreef 95',
        postalCode: '3565 CE',
        addressLocality: 'Utrecht',
        addressCountry: 'NL',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Angle Rue Prince Moulay Abdellah et Rue Nakhla, Immeuble 1er étage G4, Apt 7',
        addressLocality: 'Casablanca',
        addressCountry: 'MA',
      },
    ],
    contactPoint: OFFICES.map((office) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: office.phone.href.replace('tel:', ''),
      areaServed: office.key === 'nl' ? 'EU' : 'MA',
      availableLanguage: ['en', 'fr', 'nl'],
    })),
  };
}

export function breadcrumbs(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function itemList(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.href}`,
    })),
  };
}

export function article(a: { title: string; description: string; date: string; image: string; href: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    image: `${SITE_URL}${a.image}`,
    mainEntityOfPage: `${SITE_URL}${a.href}`,
    author: { '@type': 'Organization', name: CONTACT.company },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
