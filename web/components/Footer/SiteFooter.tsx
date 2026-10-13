import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CONTACT, OFFICES, mainNav } from '@/data/nav';
import { CATEGORIES } from '@/data/catalog';
import { categoryHref, href } from '@/data/routes';
import Logo from '@/components/Logo/Logo';
import s from './Footer.module.css';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = mainNav(locale, t);

  return (
    <footer className={s.footer}>
      <div className={`page ${s.top}`}>
        <div className={s.brand}>
          <Link href={href(locale, 'home')} aria-label={t.site.name}>
            <Logo className={s.logo} title={t.site.name} />
          </Link>
          <p className={s.tagline}>{t.site.description}</p>
        </div>

        <nav className={s.col} aria-label={t.footer.navTitle}>
          <h2 className={s.colTitle}>{t.footer.navTitle}</h2>
          <ul className={s.list}>
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, 'quote')}>{t.nav.quote}</Link>
            </li>
          </ul>
        </nav>

        <nav className={s.col} aria-label={t.footer.productsTitle}>
          <h2 className={s.colTitle}>{t.footer.productsTitle}</h2>
          <ul className={s.list}>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link href={categoryHref(locale, category)}>{t.categories[category].name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.col}>
          <h2 className={s.colTitle}>{t.footer.contactTitle}</h2>
          {OFFICES.map((office) => (
            <address key={office.key} className={s.address}>
              <strong>
                {CONTACT.company} · {t.offices[office.key].name}
              </strong>
              {office.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <a href={office.phone.href}>{office.phone.label}</a>
            </address>
          ))}
          <ul className={s.list}>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={s.bar}>
        <div className={`page ${s.barInner}`}>
          <p>
            © {new Date().getFullYear()} {CONTACT.company}. {t.footer.rights}
          </p>
          <div className={s.barLinks}>
            <Link href={href(locale, 'privacy')} className={s.toTop}>
              {t.footer.privacy}
            </Link>
            <a href="#main" className={s.toTop}>
              {t.footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
