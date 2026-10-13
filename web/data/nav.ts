import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';
import { CATEGORY_ACCENT, FRESH_CATEGORIES, productsIn, productName } from './catalog';
import { categoryHref, href, productHref } from './routes';

/**
 * The client's menu, unchanged: Home · Fresh · Frozen · Euravia · Blog · Contact, plus the
 * quote basket on the right (the moreco.ma header).
 */
export interface NavLink {
  label: string;
  href: string;
  accent?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  accent: string;
  links: NavLink[];
}

export interface NavItem extends NavLink {
  /** A plain dropdown. */
  children?: NavLink[];
  /** A mega panel: one column per group (Fresh → vegetables | fruits). */
  groups?: NavGroup[];
  /** Closing row of a panel — "all fresh produce". */
  footer?: NavLink;
}

export function mainNav(locale: Locale, t: Dictionary): NavItem[] {
  return [
    { label: t.nav.home, href: href(locale, 'home') },
    {
      label: t.nav.fresh,
      href: href(locale, 'fresh'),
      groups: FRESH_CATEGORIES.map((category) => ({
        label: t.categories[category as 'vegetables' | 'fruits'].name,
        href: categoryHref(locale, category),
        accent: CATEGORY_ACCENT[category],
        links: productsIn(category).map((p) => ({ label: productName(p, locale), href: productHref(locale, p.id) })),
      })),
      footer: { label: t.nav.allFresh, href: href(locale, 'fresh') },
    },
    {
      label: t.nav.frozen,
      href: href(locale, 'frozen'),
      children: productsIn('frozen').map((p) => ({
        label: productName(p, locale),
        href: productHref(locale, p.id),
        accent: CATEGORY_ACCENT.frozen,
      })),
      footer: { label: t.nav.allFrozen, href: href(locale, 'frozen') },
    },
    { label: t.nav.about, href: href(locale, 'about') },
    { label: t.nav.blog, href: href(locale, 'blog') },
    { label: t.nav.contact, href: href(locale, 'contact') },
  ];
}

export interface Office {
  key: 'nl' | 'ma';
  city: string;
  address: string[];
  phone: { label: string; href: string };
  map: string;
}

/** Both offices, as the client wrote them in the brief. */
export const OFFICES: Office[] = [
  {
    key: 'nl',
    city: 'Utrecht',
    address: ['Mississippidreef 95', '3565 CE Utrecht', 'Nederland'],
    phone: { label: '+31 6 59 14 57 53', href: 'tel:+31659145753' },
    map: 'https://www.google.com/maps/search/?api=1&query=Mississippidreef+95+3565+CE+Utrecht',
  },
  {
    key: 'ma',
    city: 'Casablanca',
    address: ['Angle Rue Prince Moulay Abdellah et Rue Nakhla', 'Immeuble 1er étage G4, Apt 7', 'Casablanca, Maroc'],
    phone: { label: '+212 6 03 74 81 01', href: 'tel:+212603748101' },
    map: 'https://www.google.com/maps/search/?api=1&query=Rue+Prince+Moulay+Abdellah+Rue+Nakhla+Casablanca',
  },
];

export const CONTACT = {
  company: 'Euravia',
  email: 'info@euraviafoods.com',
  /* Assumed to be the Moroccan mobile — listed in docs/CONTENT-TO-VALIDATE.md. */
  whatsapp: 'https://wa.me/212603748101',
};
