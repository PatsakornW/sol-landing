'use client';

import { useCallback, useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { progress, useScrollFrame } from '../hooks/use-scroll-frame';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';

const styles = stylex.create({
  top: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 8fr) minmax(0, 4fr)', [bp.max900]: '1fr' },
    gap: 40,
    alignItems: 'end',
  },
  manifesto: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(44px, 7vw, 120px)',
    lineHeight: 1,
    letterSpacing: '-0.04em',
    textWrap: 'balance',
  },
  /* Each word is dim until the page has scrolled it into the light. */
  word: {
    opacity: 0.13,
    transitionProperty: 'opacity, text-shadow',
    transitionDuration: '0.6s, 0.8s',
    transitionTimingFunction: 'ease',
  },
  wordOn: {
    opacity: 1,
  },
  wordGlow: {
    textShadow: '0 0 40px rgba(255, 214, 160, 0.35)',
  },
  topSub: {
    marginTop: 0,
    paddingBottom: '0.6em',
  },
});

/** How many of the last words catch the corona once they are lit. */
const GLOW = 3;

/**
 * The page's one sentence, lit a word at a time as the reader scrolls it
 * into the middle of the screen.
 */
export function Manifesto({ text, sub }: { text: string; sub: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.trim().split(/\s+/);
  const [lit, setLit] = useState(0);
  const id = useId();

  const onFrame = useCallback(
    (reduce: boolean) => {
      if (reduce) {
        setLit(words.length);
        return;
      }
      const node = ref.current;
      if (!node) return;
      setLit(Math.round(progress(node, 0.92, 0.38) * words.length));
    },
    [words.length],
  );
  useScrollFrame(onFrame);

  return (
    <div {...stylex.props(styles.top)}>
      <h2 ref={ref} id={id} {...stylex.props(styles.manifesto)}>
        {words.map((word, index) => (
          <span key={index}>
            <span
              {...stylex.props(
                styles.word,
                index < lit && styles.wordOn,
                index < lit && index >= words.length - GLOW && styles.wordGlow,
              )}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </h2>
      <p {...stylex.props(shared.sub, styles.topSub)}>{sub}</p>
    </div>
  );
}

const truthStyles = stylex.create({
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    marginTop: 'clamp(70px, 8vw, 120px)',
    display: 'grid',
    gridTemplateColumns: { default: 'repeat(3, minmax(0, 1fr))', [bp.max900]: '1fr' },
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: V3.line,
  },
  item: {
    paddingTop: { default: 40, [bp.max900]: 34 },
    paddingRight: { default: 'clamp(20px, 2.6vw, 40px)', [bp.max900]: 0 },
    paddingBottom: { default: 0, [bp.max900]: 34 },
    paddingLeft: 0,
    borderBottomWidth: { default: 0, [bp.max900]: 1 },
    borderBottomStyle: 'solid',
    borderBottomColor: V3.line,
  },
  itemNext: {
    paddingLeft: { default: 'clamp(20px, 2.6vw, 40px)', [bp.max900]: 0 },
    borderLeftWidth: { default: 1, [bp.max900]: 0 },
    borderLeftStyle: 'solid',
    borderLeftColor: V3.line,
  },
  glyph: {
    width: 84,
    height: 56,
  },
  title: {
    margin: 0,
    marginTop: 26,
    marginBottom: 12,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(25px, 2.3vw, 34px)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    textWrap: 'balance',
  },
  body: {
    margin: 0,
    color: V3.dust,
    maxWidth: '34ch',
  },
});

export type Truth = { key: string; title: string; desc: string };

function TruthGlyph({ index }: { index: number }) {
  const uid = useId().replace(/:/g, '');
  if (index === 0) {
    const pattern = `v3-slit-${uid}`;
    const mask = `v3-slit-mask-${uid}`;
    return (
      <svg viewBox="0 0 84 56" {...stylex.props(truthStyles.glyph)} aria-hidden="true">
        <defs>
          <pattern id={pattern} width="10" height="16" patternUnits="userSpaceOnUse">
            <rect width="10" height="16" fill="#fff" />
            <rect y="12.5" width="10" height="3.5" fill="#000" />
          </pattern>
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="84" height="56">
            <rect width="84" height="56" fill={`url(#${pattern})`} />
          </mask>
        </defs>
        <circle cx="30" cy="28" r="22" fill="#DC74EC" mask={`url(#${mask})`} />
        <circle
          cx="54"
          cy="28"
          r="22"
          fill="none"
          stroke="#1E69F6"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 84 56" {...stylex.props(truthStyles.glyph)} aria-hidden="true">
        <circle cx="28" cy="28" r="20" fill="#DC74EC" opacity=".85" />
        <circle cx="50" cy="28" r="20" fill="#1E69F6" />
        <path d="M60 8a28 28 0 0 1 0 40" fill="none" stroke="#FFE3B3" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M68 4a36 36 0 0 1 0 48"
          fill="none"
          stroke="#FFE3B3"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 84 56" {...stylex.props(truthStyles.glyph)} aria-hidden="true">
      <circle cx="42" cy="28" r="24" fill="none" stroke="#FFE3B3" strokeWidth="1" opacity=".5" />
      <circle cx="42" cy="28" r="20" fill="#1E69F6" />
      <path
        d="M34 28.5l5.5 5.5L51 22.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Three things a price does that a guess does not. */
export function Truths({ items }: { items: readonly Truth[] }) {
  return (
    <ul {...stylex.props(truthStyles.list)}>
      {items.map((item, index) => (
        <li key={item.key} {...stylex.props(truthStyles.item, index > 0 && truthStyles.itemNext)}>
          <TruthGlyph index={index} />
          <h3 {...stylex.props(truthStyles.title)}>{item.title}</h3>
          <p {...stylex.props(truthStyles.body)}>{item.desc}</p>
        </li>
      ))}
    </ul>
  );
}
