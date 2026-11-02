import * as stylex from '@stylexjs/stylex';

/**
 * The SolsMarket palette both designs are drawn in.
 *
 * Constants, not themeable variables: these are the brand itself — the mark's
 * two orbs, the YES/NO pair, the night ground — and no subtree is meant to
 * rebind them. The page-level roles (ground, ink, muted ink, hairline) live in
 * each design's `color` theme; these are the hues those roles are cut from.
 */
export const brand = stylex.defineConsts({
  /** The striped orb, and NO. */
  pink: '#DB75EB',
  /** The solid orb, and YES. */
  blue: '#216AF5',
  blueHover: '#3B7DF7',
  /** Between the two: the CTA's middle stop, the oracle chip. */
  violet: '#8F6FF0',
  /** The night ground. */
  night: '#06060C',
  /** One step up from the ground: tiles, inputs, the switch. */
  raised: '#0E0F18',
  /** The one light ground (V4's mechanism stage). */
  paper: '#F4F5FA',
  /** V4's ink on the night ground. */
  ink: '#D7E2EA',
  inkMuted: 'rgba(215, 226, 234, 0.55)',
  inkLine: 'rgba(215, 226, 234, 0.10)',
  /** A shade cooler and brighter than V4's ink: the corner switch's hover. */
  frost: '#F2F4F8',
  frostLine: 'rgba(242, 244, 248, 0.08)',
  /** The focus ring on the night ground. */
  ring: '#9CC0FF',
  /** The steel gradient the big headings are cut from. */
  steel: 'linear-gradient(180deg, #646973 0%, #BBCCD7 100%)',
  /** Pink to blue, the mark read left to right. */
  sweep: 'linear-gradient(90deg, #DB75EB 0%, #216AF5 100%)',
});
