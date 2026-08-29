import * as stylex from '@stylexjs/stylex';

import { media } from '../../../styles/breakpoints.stylex';
import { color } from '../../../styles/tokens.stylex';
import { flowGeom } from './flow-timing.stylex';
import { cropVars } from './mechanism-crop.stylex';

/**
 * The mechanism step's plate frame and screen — shared, for the same reason as
 * the showcase's: `MechanismPlate` (lazy, pulls `remotion`) and `MechanismCard`
 * (page bundle, renders the `PlateSkeleton`) must reserve the identical box.
 */
export const mechanismPlate = stylex.create({
  /**
   * Square cream print plate, same language as the hero articles: hard corners,
   * no bezel, crop by overflow. Caps at the composition width so a clip never
   * upscales past life size.
   */
  frame: {
    position: 'relative',
    isolation: 'isolate',
    display: 'block',
    width: '100%',
    maxWidth: flowGeom.width,
    marginInline: 'auto',
    marginBlock: 0,
    borderRadius: 0,
    aspectRatio: flowGeom.ratio,
    overflow: 'hidden',
    contain: 'paint',
    containerType: 'inline-size',
    backgroundColor: color.paper,
  },

  screen: {
    position: 'absolute',
    zIndex: 1,
    inset: 0,
  },
});

/**
 * Each flow gets its own zoom and focal point: Connect favours the modal's top,
 * Trade opens on the outcome pair, Redeem keeps the payout in frame.
 *
 * The numeric scale is a *floor*. On a narrow plate the second term takes over
 * and raises it, which is what keeps the app's 12px type at 10px or better after
 * `Thumbnail` has fitted the canvas: `composition-width * 10/12 / plate-width`,
 * capped at 2.4 so a very narrow column does not zoom into a detail.
 *
 * This was three `--mechanism-crop-*` custom properties set by dead
 * `.mechanism-card--N` rules, reading a fourth (`--mechanism-composition-width`)
 * that the card wrote as an inline style. All four are gone: the composition
 * width is `flowGeom.width`, and the per-step values are `cropVars`, which the
 * card sets through `step()` rather than through a hand-written inline style.
 *
 * `firstThatWorks` is the container-query guard — a browser without `cqi` drops
 * the first declaration as invalid and lands on the bare floor, rather than on
 * no `scale` at all.
 */
export const mechanismCrop = stylex.create({
  crop: {
    scale: {
      default: stylex.firstThatWorks(
        `max(${cropVars.floor}, min(2.4, calc(${flowGeom.width}px * 10 / 12 / 100cqi)))`,
        /* Interpolated rather than passed bare: `firstThatWorks` types every
           argument against the first one, and the first is a template literal. */
        `${cropVars.floor}`,
      ),
      /* Show more of the panel, but do not drop below the type floor. */
      [media.reduce]: stylex.firstThatWorks(
        `max(1.08, min(2.4, calc(${flowGeom.width}px * 10 / 12 / 100cqi)))`,
        '1.08',
      ),
    },
    transformOrigin: {
      default: cropVars.origin,
      [media.reduce]: '50% 50%',
    },
  },
  /** The step's own numbers, handed to the rule above as variables. */
  step: (floor: number, origin: string) => ({
    [cropVars.floor]: `${floor}`,
    [cropVars.origin]: origin,
  }),
});

/** Per-step crop, 1-based to match the copy. Index 0 is the shared default. */
export const STEP_CROP = [
  { scale: 1.14, origin: '50% 50%' },
  { scale: 1.14, origin: '40% 28%' },
  { scale: 1.16, origin: '42% 48%' },
  { scale: 1.14, origin: '40% 48%' },
] as const;
