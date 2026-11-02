import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

export const LOCALE = 'en';

/** V4's copy, under its own key beside the site's shared catalogue. */
export const messages = { ...base, v4: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}

/** The subjects the live section's headline rolls through, each followed by `live.suffix`. */
export function t4Words(): string[] {
  return en.live.words;
}

/** A V4 key: `t4('hero.lead')` reads `v4.hero.lead`. */
export function t4(key: string): string {
  return translate(`v4.${key}`);
}
