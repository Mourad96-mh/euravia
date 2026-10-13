'use client';

import { useEffect, useState } from 'react';
import { useQuote } from './QuoteProvider';
import s from './AddToQuote.module.css';

/**
 * "Ajouter au devis" — the button that fills the basket casem.ma's header button opens.
 * Once a product is in, the button says so rather than adding it twice.
 */
export default function AddToQuote({
  slug,
  labels,
  size = 'default',
}: {
  slug: string;
  labels: { add: string; inQuote: string };
  size?: 'default' | 'small';
}) {
  const { add, has, ready } = useQuote();
  const [justAdded, setJustAdded] = useState(false);
  const inQuote = ready && has(slug);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  return (
    <button
      type="button"
      className={[s.btn, size === 'small' ? s.small : '', inQuote ? s.done : ''].join(' ')}
      onClick={() => {
        if (inQuote) return;
        add(slug);
        setJustAdded(true);
      }}
      aria-pressed={inQuote}
      /* Before localStorage is read the state is unknown; keep it inert for that tick. */
      disabled={!ready}
    >
      {inQuote ? <CheckIcon /> : <PlusIcon />}
      <span>{inQuote ? labels.inQuote : labels.add}</span>
    </button>
  );
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="m4 12.5 5.2 5.2L20 7" />
  </svg>
);
