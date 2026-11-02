import * as stylex from '@stylexjs/stylex';

/**
 * Revision 7 — the candy shelf, in the mark's own two colours.
 *
 * The ground, plates and type are V5's dark theme, cooled a touch toward the
 * blue. Everything coloured on the page is the mark: its blue and its pink,
 * each in a light and a deep step, plus one navy for the darkest panels.
 * Nothing else — Yes is blue and No is pink, the way the mark's two orbs face
 * each other. Every surface is opaque and every edge is rounded.
 */
export const C = stylex.defineVars({
  /** The page ground. */
  base: '#14151D',
  /** The footer's deeper ground. */
  baseDeep: '#0D0E15',
  /** Plates: the bar, the curtain, the question and waitlist grounds. */
  plate: '#1F2130',
  /** A plate raised a step: cards, pressed pills, the last shelf panel. */
  plateDeep: '#2B2E44',
  /** Type over all of the above. */
  type: '#EEEDF5',
  typeSoft: 'rgba(238, 237, 245, 0.68)',
  line: 'rgba(255, 255, 255, 0.1)',
  /** The mark's blue, and its light and deep steps. */
  blue: '#1E69F6',
  blueLight: '#8DB8FF',
  blueDeep: '#143F9E',
  /** The mark's pink, and its light and deep steps. */
  pink: '#DC74EC',
  pinkLight: '#F2B8F6',
  pinkDeep: '#8A2FA6',
  /** The darkest coloured panel. */
  navy: '#1B1F4A',
  gutter: 'clamp(14px, 2.4vw, 32px)',
  radius: '18px',
});

export const bp = stylex.defineConsts({
  max560: '@media (max-width: 560px)',
  max760: '@media (max-width: 760px)',
  max991: '@media (max-width: 991px)',
  max1199: '@media (max-width: 1199px)',
  tablet: '@media (min-width: 600px) and (max-width: 991px)',
  min992: '@media (min-width: 992px)',
  hover: '@media (hover: hover) and (pointer: fine)',
  reduce: '@media (prefers-reduced-motion: reduce)',
  noScript: '@media (scripting: none)',
});
