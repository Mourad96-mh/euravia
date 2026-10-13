import type { Locale } from './config';
import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';
import nl from './dictionaries/nl.json';

/** English is the source language: the other files must mirror its shape, or tsc fails. */
export type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, nl };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
