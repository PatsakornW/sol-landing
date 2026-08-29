import { Easing } from 'remotion';
import type { CSSProperties } from 'react';

/**
 * The `apps/web` dark-theme tokens the clips replicate, in one place.
 *
 * Both clips (`mechanism/MechanismFlows.tsx`, `showcase/HomeFlow.tsx`) used to
 * declare their own copy of this list, which is how `#1c1c1c` and `#1c1c1b`
 * ended up as two spellings of the same ground. Two replicas of one product must
 * not hold independent opinions of the product's colours.
 *
 * Values are read off `apps/web/src/styles/base/_theme.scss` (`--c-*`) and
 * `abstracts/_variables.scss` (`$radius-*`). `globals.css`'s `--app-*` block is
 * the CSS mirror of this module, for the plain-CSS mobile stand-ins that cannot
 * import from here — edit the two together.
 *
 * Tokens used by only one clip (`PHANTOM`, the `mc-*` list-item pair, the cover
 * scrim) stay in that clip: this is the shared vocabulary, not every token.
 */

/* Surfaces and ink. */
export const BG = '#1c1c1c';
export const SURFACE = '#222222';
export const SURFACE_CARD = '#262626';
export const BORDER = '#2e2e2e';
export const TEXT = '#e5e5e5';
export const TEXT_SECONDARY = '#a1a1a1';
export const TEXT_MUTED = '#858585';

/* Outcome pair. Also `--app-yes` / `--app-no` in `globals.css`. */
export const YES = '#3dbb78';
export const NO = '#e05a5a';

/** `apps/web`'s own face. Bound explicitly rather than inherited: the clips are
    a replica of the trading app, which is typeset in Inter, while the landing
    page around them now runs a monospaced body. Inheriting would retypeset the
    product shot in the wrong family. */
export const FONT = 'var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif';

/* `$radius-*` — modals/cards 12, buttons/inputs/panels 8, chips 6. */
export const R_CARD = 12;
export const R_CTRL = 8;
export const R_CHIP = 6;

/** Hold the first and last keyframe rather than extrapolating past them. */
export const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

/** The app's entrance curve (`--ease-out` / `EASE_OUT` in `lib/ease.ts`). */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** `clamp` plus the entrance curve — the default for every `interpolate` here. */
export const ease = { ...clamp, easing: easeOut };

/** The clips' one type ramp: size, colour, weight, and the app's 1.25 leading. */
export const text = (size: number, color: string, weight = 500): CSSProperties => ({
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.25,
});

/**
 * Entrance offset. Six sites in `HomeFlow` and every `Panel` wrote this pair by
 * hand with only the travel distance differing.
 */
export const rise = (enter: number, px: number): CSSProperties => ({
  opacity: enter,
  transform: `translate3d(0, ${(1 - enter) * px}px, 0)`,
});
