import * as stylex from '@stylexjs/stylex';

/**
 * The glass scale: what a panel is cut to, and how far the ground behind it is
 * blurred.
 *
 * `defineConsts`, not a plain object — the compiler inlines these at build
 * time, and a plain `export const` imported into another module is not a value
 * StyleX can resolve; it compiles the declaration away to nothing, which is a
 * square corner and a pane of clear glass that no stylesheet admits to.
 */
export const GLASS = stylex.defineConsts({
  /** The big panels: feature cards, the closing panel. */
  panel: '28px',
  /** Anything inside one — one step in, so the two stay concentric. */
  inner: '18px',
  /** Fully round: the nav capsule, every button, the status dot. */
  pill: '999px',
  /** What a pane blurs the backdrop by. */
  blur: 'blur(18px)',
  /** The chrome blurs harder: it sits over the loudest part of the shot. */
  blurChrome: 'blur(22px)',
});
