import * as stylex from '@stylexjs/stylex';

/**
 * Clip geometry and timing, kept apart from the clips themselves.
 *
 * The card needs these numbers to drive playback, but must not pull `remotion`
 * into the page bundle to get them — that is the entire reason this is its own
 * module and not three more exports from `MechanismFlows`.
 *
 * The canvas matches the plate's 5:4 and is deliberately small: `Thumbnail`
 * scales the composition to its container, so a large canvas would shrink the
 * phone's UI type below legibility. At this size the scale factor is near 1.
 *
 * The `.stylex.ts` extension is a compiler contract, not a claim that this is a
 * stylesheet: it is what lets `stylex.create` elsewhere read a value from here.
 * StyleX only inlines cross-module values out of `defineConsts`/`defineVars` in
 * a `.stylex` file — a plain `export const` is invisible to it — so the two
 * numbers the plate's styles need are re-declared as `flowGeom` below. Playback
 * code keeps using the plain exports; nothing is duplicated, since `flowGeom`
 * is derived from them in this same file.
 */

export const FLOW_FPS = 30;
export const FLOW_DURATION = 132;
export const FLOW_WIDTH = 460;
export const FLOW_HEIGHT = 368;

/** The same canvas, in the form `stylex.create` can read. */
export const flowGeom = stylex.defineConsts({
  width: FLOW_WIDTH,
  height: FLOW_HEIGHT,
  ratio: `${FLOW_WIDTH} / ${FLOW_HEIGHT}`,
});
