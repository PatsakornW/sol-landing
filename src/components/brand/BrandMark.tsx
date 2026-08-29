import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import { color, font } from '../../styles/tokens.stylex';

/** Gaps pitched about cy=32 — slightly inset from poles, thinner cuts. */
const PURPLE_GAP_YS = [18, 25, 32, 39, 46] as const;
const PURPLE_GAP_HEIGHT = 2.25;

/* The mark's own two hues. Not tokens: they are the logo, not the palette, and
   nothing else on the site is allowed to reach for them. */
const ORB_BACK = '#DC74EC';
const ORB_FRONT = '#1E69F6';

export type BrandMarkProps = {
  /** Rendered at this size in both axes; the viewBox does the rest. */
  size?: number;
  /**
   * Present only on a mark that stands alone. Every call site here pairs the
   * mark with the wordmark, so the mark is decoration and stays out of the
   * accessibility tree.
   */
  label?: string;
};

/**
 * SolsMarket mark — striped purple orb behind a solid blue orb.
 *
 * This used to carry an `effect` prop ('glow' | 'pulse' | 'draw'), a monochrome
 * `color` override, and three `--brand-mark-*` custom properties written as
 * inline styles. All of it addressed CSS in a stylesheet that no longer exists —
 * the props compiled, rendered class names, and did nothing. A prop that cannot
 * change the output is worse than no prop: it reads as a capability. Gone.
 */
export function BrandMark({ size = 32, label }: BrandMarkProps) {
  const uid = useId().replace(/:/g, '');
  const maskId = `sm-purple-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <circle cx="23" cy="32" r="19" fill="#fff" />
          {PURPLE_GAP_YS.map((y) => (
            <rect key={y} x="4" y={y} width="38" height={PURPLE_GAP_HEIGHT} fill="#000" />
          ))}
        </mask>
      </defs>
      <g>
        <circle cx="23" cy="32" r="19" fill={ORB_BACK} mask={`url(#${maskId})`} />
        <circle cx="41" cy="32" r="19" fill={ORB_FRONT} />
      </g>
    </svg>
  );
}

const wordmarkStyles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'baseline',
    fontFamily: font.mono,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    fontSize: 15,
  },
  light: {
    color: color.fg,
  },
  dark: {
    color: '#fff',
  },
  footer: {
    fontSize: 14,
    textShadow:
      '0 1px 1px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 0, 0, 0.35)',
  },
  /* Both halves stay inside the two weights Geist Mono actually ships (400/500)
     — 700 was being synthesized into a smeared fake bold. Weight alone still
     carries the two-part rhythm, one step apart instead of three. */
  sols: {
    fontWeight: 500,
  },
  market: {
    fontWeight: 400,
  },
});

export type BrandWordmarkProps = {
  tone?: 'light' | 'dark';
  size?: 'bar' | 'footer';
};

export function BrandWordmark({ tone = 'light', size = 'bar' }: BrandWordmarkProps) {
  return (
    <span
      {...stylex.props(
        wordmarkStyles.root,
        size === 'footer' && wordmarkStyles.footer,
        tone === 'dark' ? wordmarkStyles.dark : wordmarkStyles.light,
      )}
    >
      <span {...stylex.props(wordmarkStyles.sols)}>sols</span>
      <span {...stylex.props(wordmarkStyles.market)}>market</span>
    </span>
  );
}
