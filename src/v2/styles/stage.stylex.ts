import * as stylex from '@stylexjs/stylex';

/**
 * The stage's measurements: how tall a screen is, and the two radii it uses.
 *
 * `defineConsts`, not a plain object — the compiler inlines these at build
 * time, and a plain `export const` imported into another module is not a value
 * StyleX can resolve; it compiles the declaration away to nothing.
 */
export const STAGE = stylex.defineConsts({
  /** One screen. `svh`, so a phone's collapsing toolbar cannot resize a stage
      mid-scroll and make the snap fight the reader. */
  screen: '100svh',
  /** The frame around a clip. */
  frame: '20px',
  /** Fully round: the dot rail, the buttons. */
  pill: '999px',
});
