import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CONTACT } from '@/data/nav';
import { href } from '@/data/routes';
import { breadcrumbs } from '@/data/schema';
import PageHeader from '@/components/PageHeader/PageHeader';
import OfficeCards from '@/components/OfficeCards/OfficeCards';
import ContactForm from '@/components/forms/ContactForm';
import Reveal from '@/components/Reveal/Reveal';
import JsonLd from '@/components/JsonLd/JsonLd';
import s from './ContactView.module.css';

export default function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const crumbs = [{ label: t.nav.home, href: href(locale, 'home') }, { label: t.contact.title }];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs)} />
      <PageHeader title={t.contact.title} lead={t.contact.lead} crumbs={crumbs} crumbLabel={t.a11y.breadcrumb} />

      <section className="section">
        <div className={`page ${s.layout}`}>
          <div className={s.side}>
            <OfficeCards locale={locale} />
            <Reveal className={s.quick}>
              <a className="btn" href={`mailto:${CONTACT.email}`}>
                {t.contact.emailUs}
              </a>
              <a className="btn btn--ghost" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                {t.contact.whatsapp}
              </a>
            </Reveal>
          </div>

          <Reveal delay={120} className={s.formCard}>
            <h2 className={s.formTitle}>{t.contact.formTitle}</h2>
            <ContactForm
              locale={locale}
              labels={t.contact}
              email={CONTACT.email}
              whatsapp={CONTACT.whatsapp}
              privacyHref={href(locale, 'privacy')}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
