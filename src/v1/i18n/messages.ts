import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

/**
 * The one locale this site ships in.
 *
 * Kept as a name rather than spelled `'en'` at each call site: it is what
 * `<html lang>` carries and what the copy was written against, and one name
 * says that once.
 */
export const LOCALE = 'en';

/** V1 keeps the shipped product copy and adds its own heads and figures. */
export const messages = { ...base, v1: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}
