import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

export const LOCALE = 'en';

/** V9's copy, under its own key beside the site's shared catalogue. */
export const messages = { ...base, v9: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}

/** A V9 key: `t9('hero.top')` reads `v9.hero.top`. */
export function t9(key: string): string {
  return translate(`v9.${key}`);
}
