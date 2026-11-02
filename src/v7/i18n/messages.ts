import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

export const LOCALE = 'en';

/** V7's copy, under its own key beside the site's shared catalogue. */
export const messages = { ...base, v7: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}

/** A V7 key: `t7('hero.title')` reads `v7.hero.title`. */
export function t7(key: string): string {
  return translate(`v7.${key}`);
}

/** The impact highlights: a figure for the pill and the line it stands for. */
export function impactItems(): { value: string; text: string }[] {
  return en.impact.items;
}

/** The subjects the film's captions run through, each followed by `how.roller.suffix`. */
export function rollerWords(): string[] {
  return en.how.roller.words;
}
