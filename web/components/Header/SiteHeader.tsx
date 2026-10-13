import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { mainNav, OFFICES, CONTACT } from '@/data/nav';
import { href } from '@/data/routes';
import HeaderClient from './HeaderClient';

/**
 * The moreco.ma header: a thin utility bar over a full-height main bar with the logo left,
 * hover panels, and the quote-basket button on the right. Everything interactive lives in
 * HeaderClient; this half resolves the copy.
 */
export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <HeaderClient
      locale={locale}
      nav={mainNav(locale, t)}
      homeHref={href(locale, 'home')}
      quoteHref={href(locale, 'quote')}
      phones={OFFICES.map((o) => ({ ...o.phone, code: o.key.toUpperCase() }))}
      email={CONTACT.email}
      labels={{
        quote: t.nav.quote,
        quoteShort: t.nav.quoteShort,
        openMenu: t.nav.openMenu,
        closeMenu: t.nav.closeMenu,
        language: t.nav.language,
        mainNav: t.a11y.mainNav,
        siteName: t.site.name,
      }}
    />
  );
}
