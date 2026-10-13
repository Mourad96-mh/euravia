import s from './Form.module.css';

/** One labelled input, textarea or select, with the required star the legend explains. */
export function Field({
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
  multiline = false,
  placeholder,
  hint,
  options,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>
        {label}
        {required && (
          <span className={s.req} aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {hint && <span className={s.hint}> — {hint}</span>}
      </span>
      {options ? (
        <select name={name} required={required} defaultValue={placeholder === undefined ? options[0] : ''}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : multiline ? (
        <textarea name={name} rows={5} required={required} placeholder={placeholder} />
      ) : (
        <input type={type} name={name} required={required} autoComplete={autoComplete} placeholder={placeholder} />
      )}
    </label>
  );
}

/** The honest failure: what went wrong, and two ways to reach a person anyway. */
export function FormFailure({
  text,
  email,
  whatsapp,
  orWhatsapp,
}: {
  text: string;
  email: string;
  whatsapp: string;
  orWhatsapp: string;
}) {
  return (
    <p className={s.error} role="alert">
      {text} <a href={`mailto:${email}`}>{email}</a> {orWhatsapp}{' '}
      <a href={whatsapp} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      .
    </p>
  );
}
