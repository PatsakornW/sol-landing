import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

export const LOCALE = 'en';

/** V8's copy, under its own key beside the site's shared catalogue. */
export const messages = { ...base, v8: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}

/** A V8 key: `t8('hero.lead')` reads `v8.hero.lead`. */
export function t8(key: string): string {
  return translate(`v8.${key}`);
}
