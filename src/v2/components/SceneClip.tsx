'use client';

import * as stylex from '@stylexjs/stylex';
import { ClipPlate } from '@/components/motion/ClipPlate';
import { HomeFlow } from '@/components/motion/showcase/HomeFlow';
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
 * The home composition at full size, filling the scene.
 *
 * `ShowcasePlate` is deliberately not used here. That plate is a fixed-height
 * window that pans down the composition as its frame advances — the right
 * behaviour inside a section, where the clip has to fit a band and tell a story
 * as the reader arrives. Behind this revision it is wrong twice over: the crop
 * throws most of the app away, and the pan moves the backdrop on its own while
 * the parallax is already moving it.
 *
 * So the composition is rendered whole and still: no crop, no pan, no edge
 * mask — just the app, scaled to whichever of the viewport's two axes runs out
 * first.
 *
 * Two things are asked of the composition that V5 does not ask. The event grid
 * runs two cards wide rather than four: behind a page this is scenery, and
 * fewer, wider cards keep their shape through the blur and the wash where
 * four-up dissolves into texture. And its ground is the page's own rather than
 * the app's near-black slab, so the room takes the colour of whichever theme
 * is on instead of staying dark under a light page.
 */
const GRID_CARDS = 2;

const styles = stylex.create({
  /* Fills the scene and centres the composition in it. No background of its
     own: the scene behind already has one, and an opaque frame would hide the
     wash layers further back. */
  frame: {
    position: 'absolute',
    inset: 0,
    /* The room arrives rather than appears: it settles in from a touch too
       close, over long enough to read as coming into focus rather than as
       something loading. From zero because the clip is client-only — the page
       paints its ground first either way, and fading up from that is what
       makes the seam invisible. */
    animationName: stylex.keyframes({
      from: { opacity: 0, scale: '1.05' },
      to: { opacity: 1, scale: '1' },
    }),
    animationDuration: { default: '1600ms', [media.reduce]: '1ms' },
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'both',
    display: 'grid',
    justifyItems: 'center',
    /* Anchored to the top rather than centred: the composition is portrait and
       the viewport is not, so something has to leave the frame — better the
       tail of the page than its head. */
    alignItems: 'start',
    overflow: 'hidden',
  },
  screen: {
    position: 'relative',
    aspectRatio: plateGeom.screenRatio,
  },
});

/**
 * Edge to edge: the composition takes the full width of the viewport, and its
 * own ratio decides the height.
 *
 * A dynamic style rather than a literal because the ratio is derived from the
 * composition's constants, which are plain exports — the compiler cannot read
 * those inside `create()`, and restating 1180 over the summed height here is
 * exactly the drift the geometry module exists to prevent.
 */
const fit = stylex.create({
  size: (ratio: number) => ({
    /* Cover, in one expression: the width the viewport asks for, or the width
       the viewport's HEIGHT asks for — whichever is larger. A landscape window
       takes the first and a phone the second, and neither is left with a strip
       of bare ground where the composition ran out.
       Exactly the viewport's height on the branch where the viewport wins:
       nothing pans this composition any more, so overflow below the fold is
       overflow nobody will ever see. */
    width: `max(100%, calc(100svh * ${ratio}))`,
  }),
});

export default function SceneClip() {
  const reducedMotion = usePrefersReducedMotion();

  /* The composition plays itself out once, behind the page. It used to be held
     on its last frame — a still, because a still is what a backdrop is. But
     this one has a hundred and fifty frames of the app assembling itself, and
     running them once while the reader is on the first screen costs nothing
     and says more than the finished state does. It never loops: past the last
     frame it is the still it always was. */
  const frame = usePlayOnceFrame(HOME_DURATION, HOME_FPS, {
    start: true,
    animate: !reducedMotion,
  });

  return (
    <ClipPlate
      component={HomeFlow}
      inputProps={{
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
