import type { CSSProperties } from 'react';

/**
 * A heading whose words rise one after another through a mask when its
 * Reveal parent scrolls in. Server-rendered: every word is in the markup, and
 * the hidden start state applies only under `html.js` (see `.sw` in _site.scss),
 * so the heading reads normally without JavaScript or with reduced motion.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="sw" style={{ '--w': i } as CSSProperties}>
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}
