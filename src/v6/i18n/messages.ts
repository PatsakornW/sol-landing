import { createTranslator, messages as base } from '@/i18n/messages';
import en from '../locales/en/landing.json';

export const LOCALE = 'en';

/**
 * V6's copy is V5's catalogue — the sols_market landing page's words — under
 * its own key, with a few lines of its own (the three sample questions the
 * rolling headline needed and did not have, the preloader's label).
 */
export const messages = { ...base, v6: en };

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

/** A translator scoped under `v6.<namespace>`, with `{name}` placeholders. */
export function translations(namespace?: string): Translations {
  const prefix = namespace ? `v6.${namespace}.` : 'v6.';
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
