'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';

import type { Locale } from '@/i18n/config';
import { UNITS, useQuote, type Unit } from './QuoteProvider';
import { requiredFieldsFilled } from '@/components/forms/requiredFields';
import { sendForm } from '@/components/forms/sendForm';
import { Field, FormFailure } from '@/components/forms/Field';
import s from '@/components/forms/Form.module.css';

interface CatalogueEntry {
  slug: string;
  name: string;
  image: string;
}

export type QuoteLabels = {
  basket: string;
  empty: string;
  emptyCta: string;
  remove: string;
  clear: string;
  quantity: string;
  unit: string;
  units: Record<Unit, string>;
  items: string;
  formTitle: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  destinationPick: string;
  destinationOther: string;
  destinations: string[];
  period: string;
  periodHint: string;
  message: string;
  messageHint: string;
  required: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  orWhatsapp: string;
  whatsappSend: string;
  whatsappHint: string;
  whatsappGreeting: string;
  consent: string;
};

/**
 * The quote request: the basket on the left (quantity + unit per product), the buyer's
 * details on the right. Mailed by the site's own PHP script; when that fails the form says
 * so and offers the e-mail address and WhatsApp instead of pretending to have sent.
 * The WhatsApp button is the other road: it writes the same request as a message and
 * opens WhatsApp with it, so the buyer only has to press send.
 */
export default function QuoteForm({
  locale,
  catalogue,
  productsHref,
  privacyHref,
  email,
  whatsapp,
  labels,
}: {
  locale: Locale;
  catalogue: CatalogueEntry[];
  productsHref: string;
  privacyHref: string;
  email: string;
  whatsapp: string;
  labels: QuoteLabels;
}) {
  const { lines, remove, setQuantity, setUnit, clear, ready } = useQuote();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const bySlug = new Map(catalogue.map((c) => [c.slug, c]));
  const selection = lines.map((l) => ({ ...l, product: bySlug.get(l.slug) }));

  /** The basket, then whichever details are filled in; nothing is required here. */
  function sendOnWhatsapp() {
    const data = new FormData(formRef.current ?? undefined);
    const value = (name: string) => String(data.get(name) ?? '').trim();
    const name = [value('prenom'), value('nom')].filter(Boolean).join(' ');
    const details: [string, string][] = [
      [`${labels.firstName} / ${labels.lastName}`, name],
      [labels.company, value('societe')],
      [labels.email, value('email')],
      [labels.phone, value('telephone')],
      [labels.country, value('pays')],
      [labels.destination, value('destination')],
      [labels.period, value('periode')],
    ];
    const message = value('message');
    // French puts a space before the colon; English and Dutch do not.
    const colon = locale === 'fr' ? ' : ' : ': ';

    const text = [
      labels.whatsappGreeting,
      ...selection.map((l) => `• ${l.quantity} ${labels.units[l.unit]} × ${l.product?.name ?? l.slug}`),
      '',
      ...details.filter(([, v]) => v).map(([k, v]) => `${k}${colon}${v}`),
      ...(message ? ['', message] : []),
    ]
      .join('\n')
      .trim();

    window.open(`${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!requiredFieldsFilled(form)) return;
    const data = new FormData(form);

    // The basket travels as readable text, so whoever opens the mail sees the request.
    data.set(
      'produits',
      selection
        .map((l) => `${l.quantity} ${labels.units[l.unit]} × ${l.product?.name ?? l.slug} (${l.slug})`)
        .join('\n') || '—'
    );
    data.set('langue', locale);

    setState('sending');
    try {
      await sendForm('quote', data);
      setState('sent');
      clear();
      form.reset();
    } catch {
      setState('failed');
    }
  }

  if (state === 'sent') {
    return (
      <div className={s.done} role="status">
        <CheckIcon />
        <p>{labels.success}</p>
        <Link className="btn btn--ghost" href={productsHref}>
          {labels.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className={s.layout}>
      <section className={s.basket} aria-label={labels.basket}>
        <header className={s.basketHead}>
          <h2 className={s.basketTitle}>{labels.basket}</h2>
          {ready && lines.length > 0 && (
            <button type="button" className={s.clear} onClick={clear}>
              {labels.clear}
            </button>
          )}
        </header>

        {!ready ? (
          <p className={s.empty} aria-hidden="true">
            &nbsp;
          </p>
        ) : lines.length === 0 ? (
          <div className={s.emptyBox}>
            <p className={s.empty}>{labels.empty}</p>
            <Link className="btn" href={productsHref}>
              {labels.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ul className={s.lines}>
              {selection.map((line) => (
                <li key={line.slug} className={s.line}>
                  {line.product && <Image src={line.product.image} alt="" width={56} height={56} className={s.thumb} />}

                  <div className={s.lineBody}>
                    <p className={s.lineName}>{line.product?.name ?? line.slug}</p>
                    <div className={s.qty}>
                      <label>
                        <span className="visually-hidden">
                          {labels.quantity} — {line.product?.name}
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={99999}
                          value={line.quantity}
                          onChange={(e) => setQuantity(line.slug, Number(e.target.value))}
                        />
                      </label>
                      <label>
                        <span className="visually-hidden">
                          {labels.unit} — {line.product?.name}
                        </span>
                        <select value={line.unit} onChange={(e) => setUnit(line.slug, e.target.value as Unit)}>
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {labels.units[u]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <button type="button" className={s.remove} onClick={() => remove(line.slug)}>
                    <span className="visually-hidden">
                      {labels.remove} — {line.product?.name}
                    </span>
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
            <p className={s.count}>
              {lines.length} {labels.items}
            </p>
          </>
        )}
      </section>

      <section>
        <h2 className={s.formTitle}>{labels.formTitle}</h2>

        <form ref={formRef} className={s.form} onSubmit={onSubmit}>
          {/* Bot trap: a real person never fills this in. */}
          <input type="text" name="_gotcha" className={s.gotcha} tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <p className={s.legend}>
            <span className={s.req} aria-hidden="true">
              *
            </span>{' '}
            {labels.required}
          </p>

          <div className={s.row}>
            <Field name="prenom" label={labels.firstName} required autoComplete="given-name" />
            <Field name="nom" label={labels.lastName} required autoComplete="family-name" />
          </div>
          <Field name="societe" label={labels.company} required autoComplete="organization" />
          <div className={s.row}>
            <Field name="email" label={labels.email} type="email" required autoComplete="email" />
            <Field name="telephone" label={labels.phone} type="tel" required autoComplete="tel" />
          </div>
          <div className={s.row}>
            <Field name="pays" label={labels.country} required autoComplete="country-name" />
            <Field
              name="destination"
              label={labels.destination}
              placeholder={labels.destinationPick}
              options={[...labels.destinations, labels.destinationOther]}
            />
          </div>
          <Field name="periode" label={labels.period} hint={labels.periodHint} />
          <Field name="message" label={labels.message} multiline placeholder={labels.messageHint} />

          {state === 'failed' && (
            <FormFailure text={labels.error} email={email} whatsapp={whatsapp} orWhatsapp={labels.orWhatsapp} />
          )}

          <div className={s.actions}>
            <button type="submit" className="btn" disabled={state === 'sending' || !ready || lines.length === 0}>
              {state === 'sending' ? labels.sending : labels.submit}
            </button>
            <button
              type="button"
              className={`btn btn--ghost ${s.whatsapp}`}
              onClick={sendOnWhatsapp}
              disabled={!ready || lines.length === 0}
              title={labels.whatsappHint}
            >
              <WhatsappIcon />
              {labels.whatsappSend}
            </button>
          </div>

          <p className={s.consent}>
            <Link href={privacyHref}>{labels.consent}</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z" />
  </svg>
);

export const CheckIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m7.5 12.5 3 3 6-6.5" />
  </svg>
);
