import * as stylex from '@stylexjs/stylex';

import { media, motion } from '../../../styles/breakpoints.stylex';
import { color } from '../../../styles/tokens.stylex';
import { plateGeom } from './home-timing.stylex';

/**
 * The showcase plate's frame and screen, in their own module.
 *
 * Two callers need these and they must not both be able to reach `remotion`:
 * `ShowcasePlate` (the lazy chunk) renders the real clip into them, and
 * `MarketPreview` (the page bundle) renders a `PlateSkeleton` into the same
 * frame while that chunk downloads. A shared style object is what makes the swap
 * invisible — the placeholder reserves the exact box the clip will fill, so
 * nothing shifts and nothing re-enters when the clip lands.
 *
 * This is the whole reason the rules used to be in `globals.css`: a class name
 * was the only way to share a box across a lazy boundary. A style object crosses
 * it just as well, and carries its geometry from `home-timing.stylex.ts` instead of
 * restating it as literals.
 */
export const showcasePlate = stylex.create({
  /**
   * A fixed-height window onto the full home composition.
   *
   * `container-type: inline-size` makes the plate a containment context and
   * `contain: paint` makes the crop boundary deliberate rather than an accident
   * of overflow.
   *
   * The horizontal edges dissolve into the section ground instead of ending on a
   * line — a real alpha fade applied to the whole subtree, so the app render, the
   * viewfinder falloff and the ring all fall away together. The ramp holds full
   * opacity until the last few percent (the 0.8 and 0.35 stops) so the trending
   * header at the top and the card footers at the bottom stay readable; a
   * straight two-stop gradient washes both out.
   *
   * The mask is also why this plate carries its own inset ring rather than a
   * `shadow` token: `mask-clip` is `border-box`, so every outer drop shadow would
   * be clipped away and the lift would silently disappear.
   */
  frame: {
    position: 'relative',
    isolation: 'isolate',
    containerType: 'inline-size',
    display: 'block',
    width: '100%',
    /**
     * Derived, never spelled: the desktop frame is the composition's width over
     * the settled crop's height, and the compact frame is the portrait slice.
     *
     * The media query is the fallback for exactly one render — the props-less
     * closure `next/dynamic` calls while the chunk downloads, which cannot be
     * told the regime. Every other caller passes `compact` and gets
     * `compactFrame` layered on top. It matches `PLATE_COMPACT_MAX_WIDTH`.
     */
    aspectRatio: {
      default: plateGeom.cropRatio,
      [media.maxMd]: plateGeom.compactRatio,
    },
    overflow: 'hidden',
    contain: 'paint',
    backgroundColor: color.appBg,
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.07)',
    maskImage: `linear-gradient(
      to bottom,
      rgb(0 0 0 / 0) 0%,
      rgb(0 0 0 / 0.35) 2.5%,
      rgb(0 0 0 / 0.8) 5.5%,
      rgb(0 0 0 / 1) 9%,
      rgb(0 0 0 / 1) 90%,
      rgb(0 0 0 / 0.8) 94%,
      rgb(0 0 0 / 0.35) 97.5%,
      rgb(0 0 0 / 0) 100%
    )`,
    /**
     * Soft viewfinder falloff on the two side edges only. The top and bottom
     * used to carry a dark wash for the same reason, but the mask above fades
     * them properly — a wash under a fade reads as a smudge.
     */
    '::after': {
      position: 'absolute',
      zIndex: 2,
      inset: 0,
      content: '""',
      pointerEvents: 'none',
      backgroundImage: `linear-gradient(to right, rgba(28, 28, 27, 0.2) 0%, rgba(28, 28, 27, 0.07) 4%, transparent 10%),
        linear-gradient(to left, rgba(28, 28, 27, 0.2) 0%, rgba(28, 28, 27, 0.07) 4%, transparent 10%)`,
      boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.055)',
    },
  },

  /** The regime a caller that knows it passes explicitly. */
  compactFrame: {
    aspectRatio: plateGeom.compactRatio,
  },

  /**
   * One reveal for the frame, whichever fills it. Declared on the frame rather
   * than on the clip so the swap from placeholder to clip is invisible: nothing
   * re-enters when the chunk lands.
   */
  enter: {
    /* The reveal is latched by JS, so a page without it would keep the frame
       invisible forever. */
    opacity: {
      default: 0,
      [media.noScript]: 1,
    },
    translate: {
      default: '0 16px',
      [media.noScript]: '0 0',
      [media.reduce]: '0 0',
    },
    /* Longhands rather than the `transition` shorthand, so reduced motion can
       drop `translate` from the list without restating the timing. */
    transitionProperty: {
      default: 'opacity, translate',
      [media.reduce]: 'opacity',
    },
    transitionDuration: '520ms',
    transitionTimingFunction: motion.ease,
  },

  revealed: {
    opacity: 1,
    translate: '0 0',
  },

  /**
   * The full composition, pulled up so the band the frame wants lands at the
   * frame's top edge. Sized and panned by `pan()` below.
   */
  screen: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    aspectRatio: plateGeom.screenRatio,
  },
});

/**
 * The crop, as a dynamic style.
 *
 * `zoom` is 1 on a desktop stage (the canvas fills the plate width) and >1 on a
 * phone, where the screen is laid out wider than the frame and the frame clips
 * it — that is the whole of the compact crop.
 *
 * `crop` is a fraction of the composition height, not a pixel offset: a
 * percentage translate resolves against the element's own box, so the pan stays
 * exact at any zoom without the offset having to know what the zoom is.
 */
export const showcaseCrop = stylex.create({
  pan: (zoom: number, crop: number) => ({
    width: `calc(100% * ${zoom})`,
    translate: `0 calc(${crop} * -100%)`,
  }),
});
