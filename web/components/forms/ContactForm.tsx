'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import type { Locale } from '@/i18n/config';
import { requiredFieldsFilled } from './requiredFields';
import { sendForm } from './sendForm';
import { Field, FormFailure } from './Field';
import { CheckIcon } from '@/components/Quote/QuoteForm';
import s from './Form.module.css';

export type ContactLabels = {
  formTitle: string;
  subject: string;
  subjects: string[];
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  required: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  orWhatsapp: string;
  consent: string;
};

export default function ContactForm({
  locale,
  labels,
  email,
  whatsapp,
  privacyHref,
}: {
  locale: Locale;
  labels: ContactLabels;
  email: string;
  whatsapp: string;
  privacyHref: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!requiredFieldsFilled(form)) return;
    const data = new FormData(form);
    data.set('langue', locale);

    setState('sending');
    try {
      await sendForm('contact', data);
      setState('sent');
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
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <input type="text" name="_gotcha" className={s.gotcha} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <p className={s.legend}>
        <span className={s.req} aria-hidden="true">
          *
        </span>{' '}
        {labels.required}
      </p>

      <Field name="sujet" label={labels.subject} options={labels.subjects} required />
      <div className={s.row}>
        <Field name="prenom" label={labels.firstName} required autoComplete="given-name" />
        <Field name="nom" label={labels.lastName} required autoComplete="family-name" />
      </div>
      <div className={s.row}>
        <Field name="societe" label={labels.company} autoComplete="organization" />
        <Field name="pays" label={labels.country} required autoComplete="country-name" />
      </div>
      <div className={s.row}>
        <Field name="email" label={labels.email} type="email" required autoComplete="email" />
        <Field name="telephone" label={labels.phone} type="tel" autoComplete="tel" />
      </div>
      <Field name="message" label={labels.message} multiline required />

      {state === 'failed' && (
        <FormFailure text={labels.error} email={email} whatsapp={whatsapp} orWhatsapp={labels.orWhatsapp} />
      )}

      <button type="submit" className="btn" disabled={state === 'sending'}>
        {state === 'sending' ? labels.sending : labels.submit}
      </button>

      <p className={s.consent}>
        <Link href={privacyHref}>{labels.consent}</Link>
      </p>
    </form>
  );
}
