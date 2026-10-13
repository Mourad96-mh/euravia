import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { href } from '@/data/routes';
import Reveal from '@/components/Reveal/Reveal';
import s from './QuoteBand.module.css';

/**
 * The closing call to action of moreco.ma: a dark band that ends the page flush against
 * the footer (`data-flush-footer`, see globals.css), its foot fading into the footer colour.
 */
export default function QuoteBand({ locale, title, text }: { locale: Locale; title?: string; text?: string }) {
  const t = getDictionary(locale);
  return (
    <section className={s.band} data-flush-footer>
      <div className="page">
        <Reveal className={s.inner}>
          <div>
            <h2 className={s.title}>{title ?? t.home.quoteTitle}</h2>
            <p className={s.text}>{text ?? t.home.quoteText}</p>
          </div>
          <Link className="btn btn--sun" href={href(locale, 'quote')}>
            {t.home.quoteCta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
