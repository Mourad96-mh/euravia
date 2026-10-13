'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * The "demande de devis" basket, modelled on moreco.ma: products are collected as the
 * visitor browses, the header shows the count, and /devis turns the list into a request.
 *
 * There is no server — the selection lives in localStorage on the visitor's own machine
 * until they submit the form, which posts to the mail endpoint.
 */
export const UNITS = ['pallets', 'kg', 'containers'] as const;
export type Unit = (typeof UNITS)[number];

/** `slug` is the product id; produce is bought by the pallet unless the buyer says otherwise. */
export interface QuoteLine {
  slug: string;
  quantity: number;
  unit: Unit;
}

interface QuoteContextValue {
  lines: QuoteLine[];
  count: number;
  /** False until localStorage has been read, so SSR and first paint agree. */
  ready: boolean;
  has: (slug: string) => boolean;
  add: (slug: string, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  setUnit: (slug: string, unit: Unit) => void;
  clear: () => void;
}

const STORAGE_KEY = 'euravia.quote.v1';

const QuoteContext = createContext<QuoteContextValue | null>(null);

function read(): QuoteLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is QuoteLine =>
          !!l && typeof (l as QuoteLine).slug === 'string' && Number.isFinite((l as QuoteLine).quantity)
      )
      .map((l) => ({
        slug: l.slug,
        quantity: Math.max(1, Math.min(99999, Math.round(l.quantity))),
        unit: (UNITS as readonly string[]).includes(l.unit) ? l.unit : 'pallets',
      }));
  } catch {
    // Private mode, blocked storage, corrupted value: start from an empty basket.
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Nothing to do: the basket still works for this page view.
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, quantity = 1) => {
    setLines((current) => {
      const found = current.find((l) => l.slug === slug);
      if (!found) return [...current, { slug, quantity, unit: 'pallets' }];
      return current.map((l) =>
        l.slug === slug ? { ...l, quantity: Math.min(99999, l.quantity + quantity) } : l
      );
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((l) => l.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const q = Math.max(1, Math.min(99999, Math.round(quantity) || 1));
    setLines((current) => current.map((l) => (l.slug === slug ? { ...l, quantity: q } : l)));
  }, []);

  const setUnit = useCallback((slug: string, unit: Unit) => {
    setLines((current) => current.map((l) => (l.slug === slug ? { ...l, unit } : l)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      lines,
      count: lines.length,
      ready,
      has: (slug) => lines.some((l) => l.slug === slug),
      add,
      remove,
      setQuantity,
      setUnit,
      clear,
    }),
    [lines, ready, add, remove, setQuantity, setUnit, clear]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>');
  return ctx;
}
