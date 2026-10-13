import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { CONTACT, OFFICES } from '@/data/nav';
import Reveal from '@/components/Reveal/Reveal';
import s from '@/views/Shared.module.css';

/** The two offices side by side: Utrecht in brand green, Casablanca in sun orange. */
export default function OfficeCards({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const accent = { nl: 'var(--brand)', ma: 'var(--sun-dark)' } as const;

  return (
    <div className={s.offices}>
      {OFFICES.map((office, i) => (
        <Reveal key={office.key} delay={i * 110}>
          <address className={s.office} style={{ '--accent': accent[office.key] } as React.CSSProperties}>
            <span className={s.officeFlag}>{t.offices[office.key].name}</span>
            <h3 className={s.officeCity}>{office.city}</h3>
            <p className={s.officeRole}>{t.offices[office.key].role}</p>
            {office.address.map((line) => (
              <span key={line} className={s.officeLine}>
                {line}
              </span>
            ))}
            <span className={s.officeLinks}>
              <a href={office.phone.href}>{office.phone.label}</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a href={office.map} target="_blank" rel="noopener noreferrer">
                {t.offices.map} ↗
              </a>
            </span>
          </address>
        </Reveal>
      ))}
    </div>
  );
}
