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

/**
 * V5's copy is the sols_market landing app's catalogue, carried over whole
 * under its own key so none of its sections collide with the shipped page's.
 */
export const messages = { ...base, v5: en };

const translate = createTranslator(messages);

export function translatorFor() {
  return translate;
}

type Values = Record<string, string | number>;

export type Translations = {
  (key: string, values?: Values): string;
  /** The node at `key` as it is in the catalogue: for lists. */
  raw: (key: string) => unknown;
};

function node(path: string): unknown {
  let current: unknown = en;
  for (const part of path.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * The source app read its copy through next-intl's `useTranslations(ns)`:
 * a function of a dotted key under an optional namespace, with `{name}`
 * placeholders filled from a second argument and `.raw()` for arrays. This
 * is that surface over the site's own catalogue, so the components carried
 * over keep their call sites. Not a hook: there is nothing to subscribe to.
 */
export function translations(namespace?: string): Translations {
  const prefix = namespace ? `v5.${namespace}.` : 'v5.';
  const t = ((key: string, values?: Values) => {
    let text = translate(`${prefix}${key}`);
    if (values) {
      for (const [name, value] of Object.entries(values)) {
        text = text.split(`{${name}}`).join(String(value));
      }
    }
    return text;
  }) as Translations;
  t.raw = (key: string) => node(`${namespace ? `${namespace}.` : ''}${key}`);
  return t;
}
