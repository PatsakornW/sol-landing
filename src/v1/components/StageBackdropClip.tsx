'use client';

import * as stylex from '@stylexjs/stylex';
import { ClipPlate } from '@/components/motion/ClipPlate';
import { HomeFlow } from '@/components/motion/showcase/HomeFlow';
import { useShowcaseNews } from '@/lib/hooks/use-showcase-news';
import { usePlayOnceFrame, usePrefersReducedMotion } from '@/lib/remotion';
import {
  HOME_DURATION,
  HOME_FPS,
  HOME_HEIGHT,
  HOME_WIDTH,
  plateGeom,
} from '../../components/motion/showcase/home-timing.stylex';
import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';

/**
 * How much of the app the opening shot shows.
 *
 * Four grid cards is what the real screen packs into that row; behind a
 * headline it is four small rectangles that dissolve into texture the moment
 * the blur lands. Two survive it with their shape intact, which is all a
 * backdrop needs to say.
 */
const GRID_CARDS = 2;

const styles = stylex.create({
  /* Fills the stage and anchors the composition to the top of it: the
     composition is portrait, the stage is not, so something has to leave the
     frame — better its tail than its head. */
  frame: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'start',
    overflow: 'hidden',
    /* The shot arrives rather than appears: it settles in from a touch too
       close, over long enough that a reader registers it as the room coming
       into focus rather than as something loading. It starts at zero because
       the clip is client-only — the stage paints its ground first either way,
       and fading in from that is what makes the seam invisible. */
    animationName: stylex.keyframes({
      from: { opacity: 0, scale: '1.06' },
      to: { opacity: 0.4, scale: '1' },
    }),
    animationDuration: { default: '1400ms', [media.reduce]: '1ms' },
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'both',
    /* Far enough off the focal plane that the app reads as a room rather than
       as a second page of type. A phone holds the headline closer to it and
       has no room to escape into, so it gets more of both. */
    filter: { default: 'blur(9px)', [media.md]: 'blur(9px)' },
    opacity: { default: 0.16, [media.md]: 0.4 },
    /* The copy sits on this, so the shot has to be gone by the time it reaches
       the bottom of the stage where the form and the scroll cue are. */
    maskImage: 'linear-gradient(to bottom, black 0%, black 46%, transparent 92%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 46%, transparent 92%)',
    pointerEvents: 'none',
  },
  screen: {
    position: 'relative',
    aspectRatio: plateGeom.screenRatio,
  },
});

/**
 * Cover, in one expression: the width the stage asks for, or the width one
 * screen of HEIGHT asks for — whichever is larger, so neither shape is left
 * with a strip of bare ground where the composition ran out. `100svh` is the
 * stage's own height (`STAGE.screen`), which is why it can stand in for a
 * parent height CSS has no other way to reach from a width.
 *
 * A dynamic style rather than a literal because the ratio is derived from the
 * composition's constants, which are plain exports — the compiler cannot read
 * those inside `create()`, and restating 1180 over the summed height here is
 * exactly the drift the geometry module exists to prevent.
 */
const fit = stylex.create({
  size: (ratio: number) => ({ width: `max(100%, calc(100svh * ${ratio}))` }),
});

/**
 * The opening shot's backdrop, drawn.
 *
 * The stage used to run the shipped hero's print plates back here. Those are
 * an illustration of the product's subject; this is the product. It is blurred
 * and dimmed to well under the headline, given the page's own ground rather
 * than the app's near-black slab, and held on a late frame — nothing about it
 * moves, so the first screen is an image with words on it rather than a video
 * playing behind them.
 */
export default function StageBackdropClip() {
  const { news, headline } = useShowcaseNews();
  const reducedMotion = usePrefersReducedMotion();

  /* The composition plays itself out once, behind the headline. It used to be
     held on its last frame — a still, because a still is what a backdrop is.
     But this one has a hundred and fifty frames of the app assembling itself,
     and running them once while the reader reads the first screen costs
     nothing and says more than the finished state does. It never loops: past
     the last frame it is the still it always was. */
  const frame = usePlayOnceFrame(HOME_DURATION, HOME_FPS, {
    start: true,
    animate: !reducedMotion,
  });

  return (
    <ClipPlate
      component={HomeFlow}
      inputProps={{
        news,
        headline,
        cards: GRID_CARDS,
        background: color.surface3,
      }}
      frame={frame}
      durationInFrames={HOME_DURATION}
      fps={HOME_FPS}
      compositionWidth={HOME_WIDTH}
      compositionHeight={HOME_HEIGHT}
      frameStyle={styles.frame}
      screenStyle={[styles.screen, fit.size(HOME_WIDTH / HOME_HEIGHT)]}
    />
  );
}
