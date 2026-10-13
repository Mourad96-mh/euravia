import Image from 'next/image';

import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { href } from '@/data/routes';
import { breadcrumbs } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import FeatureRow from '@/components/FeatureRow/FeatureRow';
import OfficeCards from '@/components/OfficeCards/OfficeCards';
import QuoteBand from '@/components/QuoteBand/QuoteBand';
import Reveal from '@/components/Reveal/Reveal';
import JsonLd from '@/components/JsonLd/JsonLd';
import s from './AboutView.module.css';

/** "Euravia" in the menu: the client's own About text, laid out in the moreco grammar. */
export default function AboutView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const crumbs = [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.nav.about }];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <PageHeader
        eyebrow={t.site.name}
        title={t.about.title}
        lead={t.about.lead}
        crumbs={crumbs}
        crumbLabel={t.a11y.breadcrumb}
        image="/media/scenes/about.webp"
      />

      <section className="section">
        <div className={`page ${s.mission}`}>
          <Reveal>
            <p className={s.lead}>{t.about.mission[0]}</p>
          </Reveal>
          <Reveal delay={120} className={s.aside}>
            <p>{t.about.mission[1]}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="page">
          <Reveal>
            <h2 className={s.center}>{t.about.footprintTitle}</h2>
          </Reveal>
          <FeatureRow
            index={0}
            eyebrow={t.about.footprintTitle}
            title={t.about.morocco.title}
            body={<p>{t.about.morocco.text}</p>}
            image="/media/scenes/morocco.webp"
            imageAlt={t.about.morocco.title}
            accent="var(--brand)"
          />
          <FeatureRow
            index={1}
            eyebrow={t.about.footprintTitle}
            title={t.about.mediterranean.title}
            body={<p>{t.about.mediterranean.text}</p>}
            image="/media/scenes/mediterranean.webp"
            imageAlt={t.about.mediterranean.title}
            accent="var(--sun-dark)"
          />
        </div>
      </section>

      <section className={`section ${s.promise}`}>
        <div className={`page ${s.promiseInner}`}>
          <Reveal className={s.promiseMedia}>
            <Image src="/media/scenes/frozen.webp" alt="" width={1200} height={800} sizes="(min-width: 860px) 520px, 100vw" />
          </Reveal>
          <Reveal delay={120}>
            <h2>{t.about.promiseTitle}</h2>
            <p>{t.about.promiseText}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <Reveal className="section-head">
            <h2>{t.about.officesTitle}</h2>
          </Reveal>
          <OfficeCards locale={locale} />
        </div>
      </section>

      <QuoteBand locale={locale} />
    </>
  );
}
