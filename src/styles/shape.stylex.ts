import * as stylex from '@stylexjs/stylex';

/**
 * The corner scale, as variables instead of as React state.
 *
 * This replaces `lib/shape-context.tsx`: a provider that held a `'pill' |
 * 'rounded'` in `useState`, wrote `--shape-input-radius` onto
 * `document.documentElement` in an effect, toggled a `.transitioning` class
 * around the change, and handed three numbers down through context so that
 * `card`, `input-group` and `accordion` could spell them back out as inline
 * `style={{ borderRadius }}` on eleven elements.
 *
 * Every one of those layers existed to do what a themeable variable does for
 * free. `borderRadius: shape.bgRadius` in a `stylex.create` block is the whole
 * mechanism now: no context read, no re-render, no inline style, and the value
 * still swaps for any subtree that applies `pill` — which is more than the
 * provider could do, since it only ever had one global setting.
 *
 * Defaults are the `rounded` scale, which is the only one the site ever used.
 */
export const shape = stylex.defineVars({
  /** Fills and plates: the radius of a surface the user sees as a box. */
  bgRadius: '3px',
  /** Where two surfaces meet and share an edge, so the seam is not doubled. */
  mergedRadius: '3px',
  /** Two pixels outside `bgRadius`, so a focus ring sits concentric to it. */
  focusRingRadius: '5px',
});

/** The soft scale, for any subtree that wants it. Nothing applies it today. */
export const pill = stylex.createTheme(shape, {
  bgRadius: '20px',
  mergedRadius: '16px',
  focusRingRadius: '22px',
});
