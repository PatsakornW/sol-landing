import en from '../locales/en/landing.json';

/**
 * The one locale this site ships in.
 *
 * Kept as a name rather than spelled `'en'` at each call site: it is what
 * `<html lang>` carries and what the copy was written against.
 */
export const LOCALE = 'en';

/** A catalogue: nested objects with strings at the leaves. */
export type Messages = Record<string, unknown>;

/**
 * The page's copy.
 *
 * One catalogue, and no library around it. This site ships in English only, so
 * what a translation runtime was doing here — picking a catalogue per request,
 * carrying a locale through every layout, publishing it to the client through a
 * provider — was three kinds of work with one possible answer.
 *
 * The copy stays in JSON rather than being inlined at its call sites: it is
 * still the one place to read the whole page's words.
 */
export const messages: Messages = en;

/**
 * Resolve a dotted key against a catalogue.
 *
 * A missing or non-string key throws rather than rendering itself. Every page
 * here is prerendered, so a typo surfaces as a build failure with the key in
 * the message — which is the moment to find out, rather than shipping the word
 * `close.title` to a reader.
 */
export function createTranslator(catalogue: Messages) {
  return (key: string): string => {
    let node: unknown = catalogue;
    for (const part of key.split('.')) {
      if (typeof node !== 'object' || node === null) {
        node = undefined;
        break;
      }
      node = (node as Record<string, unknown>)[part];
    }
    if (typeof node !== 'string') {
      throw new Error(`Missing copy for "${key}".`);
    }
    return node;
  };
}

/** The shipped page's translator. */
export const t = createTranslator(messages);

/** Named for the call sites that read as `const t = translatorFor()`. */
export function translatorFor() {
  return t;
}
