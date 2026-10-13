'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { LOCALES, LOCALE_NAMES, isLocale, type Locale } from '@/i18n/config';
import type { NavItem } from '@/data/nav';
import { resolveRoute, translationsOf } from '@/data/routes';
import { useQuote } from '@/components/Quote/QuoteProvider';
import Logo from '@/components/Logo/Logo';
import s from './Header.module.css';

interface Props {
  locale: Locale;
  nav: NavItem[];
  homeHref: string;
  quoteHref: string;
  phones: { label: string; href: string; code: string }[];
  email: string;
  labels: {
    quote: string;
    quoteShort: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    mainNav: string;
    siteName: string;
  };
}

export default function HeaderClient({ locale, nav, homeHref, quoteHref, phones, email, labels }: Props) {
  const pathname = usePathname();
  const { count, ready } = useQuote();

  /**
   * Over the home hero the header is transparent and turns solid on scroll (moreco.ma's
   * "phantom" header). Only the home page opens on a full-screen film, so only it floats.
   */
  const isHome = pathname === homeHref || pathname === homeHref.replace(/\/$/, '');
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Any navigation closes whatever was open.
  useEffect(() => {
    setDrawer(false);
    setOpenIndex(null);
  }, [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [drawer]);

  /** Hover opens a panel; a short delay on leaving stops it flickering between items. */
  const openNow = (i: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };
  const closeSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 140);
  };
  const closeNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenIndex(null);
  };

  // Escape or a click outside the nav dismisses an open panel.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNow();
    };
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) closeNow();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [openIndex]);

  /** Highlights the section you are in, including from a page below it. */
  const matches = (link: string) => {
    const base = link.split('#')[0].replace(/\/$/, '');
    const here = pathname.replace(/\/$/, '');
    return base !== '' && (here === base || here.startsWith(`${base}/`));
  };
  const isCurrent = (item: NavItem) =>
    item.href === homeHref ? isHome : matches(item.href);

  /** A language picked here is remembered: the bare domain honours it next time. */
  const rememberLocale = (value: Locale) => {
    try {
      localStorage.setItem('euravia:lang', value);
    } catch {
      /* Private mode: the switch still works, it is just not kept. */
    }
  };

  /** The switcher stays on the same page rather than dropping people on the home. */
  const alternates = (() => {
    const [first, ...rest] = pathname.split('/').filter(Boolean);
    const current = first && isLocale(first) ? resolveRoute(first as Locale, rest) : undefined;
    if (current) return translationsOf(current.key);
    return LOCALES.map((l) => ({ locale: l, href: `/${l}/` }));
  })();

  const transparent = isHome && !scrolled && !drawer;

  const languageLinks = (active: string, idle: string) =>
    alternates.map(({ locale: l, href: h }) => (
      <Link
        key={l}
        href={h}
        hrefLang={l}
        className={l === locale ? active : idle}
        aria-current={l === locale ? 'true' : undefined}
        onClick={() => rememberLocale(l)}
      >
        <span aria-hidden="true">{l.toUpperCase()}</span>
        <span className="visually-hidden">{LOCALE_NAMES[l]}</span>
      </Link>
    ));

  return (
    <header
      className={[s.header, transparent ? s.isTransparent : s.isSolid, scrolled ? s.isScrolled : ''].join(' ')}
      data-transparent={transparent ? 'true' : 'false'}
    >
      <div className={s.topbar}>
        <div className={`page ${s.topbarInner}`}>
          <div className={s.topLeft}>
            {phones.map((p) => (
              <a key={p.href} className={s.topLink} href={p.href}>
                <PhoneIcon />
                <span className={s.topCode}>{p.code}</span>
                <span className={s.topText}>{p.label}</span>
              </a>
            ))}
            <a className={`${s.topLink} ${s.topMail}`} href={`mailto:${email}`}>
              <MailIcon />
              <span className={s.topText}>{email}</span>
            </a>
          </div>

          <nav className={s.langs} aria-label={labels.language}>
            {languageLinks(s.langActive, s.lang)}
          </nav>
        </div>
      </div>

      <div className={s.main}>
        <div className={`page ${s.mainInner}`}>
          <Link href={homeHref} className={s.logo} aria-label={labels.siteName}>
            <Logo className={s.logoImg} title={labels.siteName} />
          </Link>

          <nav className={s.nav} aria-label={labels.mainNav} ref={navRef}>
            <ul className={s.navList}>
              {nav.map((item, i) => {
                const hasPanel = !!(item.children || item.groups);
                return (
                  <li
                    key={item.label}
                    className={s.navItem}
                    onMouseEnter={() => hasPanel && openNow(i)}
                    onMouseLeave={closeSoon}
                  >
                    <Link
                      href={item.href}
                      className={s.navLink}
                      aria-expanded={hasPanel ? openIndex === i : undefined}
                      aria-haspopup={hasPanel ? 'true' : undefined}
                      aria-current={isCurrent(item) ? 'true' : undefined}
                      onFocus={() => hasPanel && openNow(i)}
                    >
                      <span>{item.label}</span>
                      {hasPanel && <ChevronIcon />}
                    </Link>

                    {hasPanel && (
                      <div
                        className={[s.panelWrap, item.groups ? s.panelWrapMega : '', openIndex === i ? s.panelOpen : ''].join(' ')}
                      >
                        {/* The wrapper's padding is the bridge the pointer crosses on its way
                            down from the label, so the panel cannot flicker shut. */}
                        <div className={item.groups ? s.mega : s.panel}>
                          {item.groups ? (
                            <div className={s.megaGrid}>
                              {item.groups.map((group) => (
                                <div
                                  key={group.label}
                                  className={s.megaCol}
                                  style={{ '--accent': group.accent } as React.CSSProperties}
                                >
                                  <Link href={group.href} className={s.megaHead}>
                                    <span className={s.megaDot} aria-hidden="true" />
                                    <span>{group.label}</span>
                                    <ArrowIcon />
                                  </Link>
                                  <ul className={s.megaList}>
                                    {group.links.map((link) => (
                                      <li key={link.href}>
                                        <Link href={link.href} className={s.megaLink}>
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <ul className={s.panelList}>
                              {item.children!.map((child) => (
                                <li key={child.href}>
                                  <Link href={child.href} className={s.panelLink}>
                                    <span>{child.label}</span>
                                    <ArrowIcon />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.footer && (
                            <Link href={item.footer.href} className={s.megaFooter}>
                              <span>{item.footer.label}</span>
                              <ArrowIcon />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href={quoteHref} className={s.quote}>
            <CartIcon />
            <span className={s.quoteLabel}>{labels.quote}</span>
            <span className={s.quoteLabelShort}>{labels.quoteShort}</span>
            {ready && count > 0 && <span className={s.badge}>{count}</span>}
          </Link>

          <button
            type="button"
            className={s.burger}
            aria-expanded={drawer}
            aria-controls="mobile-drawer"
            onClick={() => setDrawer((v) => !v)}
          >
            <span className="visually-hidden">{drawer ? labels.closeMenu : labels.openMenu}</span>
            <span className={s.burgerBars} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-drawer" className={[s.drawer, drawer ? s.drawerOpen : ''].join(' ')} hidden={!drawer}>
        {/* The drawer paints over the header, so it carries its own logo and close button. */}
        <div className={s.drawerTop}>
          <Link href={homeHref} className={s.drawerLogo} aria-label={labels.siteName}>
            <Logo className={s.drawerLogoImg} title={labels.siteName} />
          </Link>
          <button type="button" className={s.drawerClose} onClick={() => setDrawer(false)}>
            <span className="visually-hidden">{labels.closeMenu}</span>
            <CloseIcon />
          </button>
        </div>

        <nav aria-label={labels.mainNav}>
          <ul className={s.drawerList}>
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={s.drawerLink} aria-current={isCurrent(item) ? 'true' : undefined}>
                  {item.label}
                </Link>
                {(item.groups ?? (item.children ? [{ label: '', href: '', accent: item.children[0]?.accent ?? '', links: item.children }] : [])).map(
                  (group) => (
                    <div key={group.label || item.label} style={{ '--accent': group.accent } as React.CSSProperties}>
                      {group.label && (
                        <Link href={group.href} className={s.drawerGroup}>
                          <span className={s.drawerDot} aria-hidden="true" />
                          {group.label}
                        </Link>
                      )}
                      <ul className={s.drawerSub}>
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className={s.drawerSubLink}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link href={quoteHref} className={`btn ${s.drawerQuote}`}>
          <CartIcon />
          {labels.quote}
          {ready && count > 0 && <span className={s.badge}>{count}</span>}
        </Link>

        <div className={s.drawerContacts}>
          {phones.map((p) => (
            <a key={p.href} className={s.drawerPhone} href={p.href}>
              <PhoneIcon />
              <span className={s.topCode}>{p.code}</span> {p.label}
            </a>
          ))}
          <a className={s.drawerPhone} href={`mailto:${email}`}>
            <MailIcon />
            {email}
          </a>
        </div>

        <nav className={s.drawerLangs} aria-label={labels.language}>
          {languageLinks(s.drawerLangActive, s.drawerLang)}
        </nav>
      </div>

      {drawer && <button className={s.scrim} onClick={() => setDrawer(false)} aria-hidden="true" tabIndex={-1} />}
    </header>
  );
}

/* ---------- icons ---------- */

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M1 1h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 6H5.5" />
    <circle cx="9.5" cy="20" r="1.6" />
    <circle cx="18" cy="20" r="1.6" />
  </svg>
);
