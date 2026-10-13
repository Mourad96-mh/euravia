/**
 * Where the contact and quote forms go: public/api/<form>.php, small mailers on the site's
 * own server that sign in to the client's mailbox over SMTP (see public/api/mailer.php).
 * Not a form service: on moreco.ma EmailJS capped requests at 50 KB and FormSubmit's
 * activation answered 500. The scripts only run on the PHP host, so under `next dev` or on
 * a static preview every form reports a failure — honestly.
 */
export type MailerForm = 'contact' | 'quote';

/** Resolves once the server has mailed the form, throws otherwise. */
export async function sendForm(form: MailerForm, data: FormData): Promise<void> {
  // The honeypot: a person never sees this field, so a filled one is a robot. Pretend it
  // went through rather than tell the robot what gave it away.
  const trap = data.get('_gotcha');
  if (typeof trap === 'string' && trap !== '') return;

  const response = await fetch(`/api/${form}.php`, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
  });
  const result = (await response.json().catch(() => ({}))) as { success?: boolean };
  if (!response.ok || result.success !== true) {
    throw new Error(`${response.status} ${JSON.stringify(result)}`);
  }
}
