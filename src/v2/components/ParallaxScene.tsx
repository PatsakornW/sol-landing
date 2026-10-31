'use client';

import dynamic from 'next/dynamic';
import * as stylex from '@stylexjs/stylex';
import { PlateSkeleton } from '@/components/motion/PlateSkeleton';
import { showcasePlate } from '@/components/motion/showcase/showcase-plate.styles';
import { useCompactPlate, usePlate } from '@/lib/remotion';
import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

const SceneClip = dynamic(() => import('./SceneClip'), {
  ssr: false,
  loading: () => <PlateSkeleton frame={showcasePlate.frame} tone="dark" />,
});

const styles = stylex.create({
  /* The scene sits behind the document and never takes the pointer. The
     perspective lives here so every layer inside shares one vanishing point —
     without it `translateZ` is just a number that does nothing. */
  scene: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    perspective: '1200px',
    perspectiveOrigin: '50% 40%',
    backgroundColor: color.surface3,
    pointerEvents: 'none',
  },
  stage: {
    position: 'absolute',
    inset: 0,
    transformStyle: 'preserve-3d',
  },
  /* Two soft washes at the back of the room. They are the only thing on the
     page that is purely decorative, and they never move on their own. */
  blob: {
    position: 'absolute',
    borderRadius: GLASS.pill,
    filter: 'blur(120px)',
    willChange: 'transform',
  },
  blobOne: {
    top: '-18%',
    left: '-12%',
    width: '62vw',
    height: '62vw',
    maxWidth: 900,
    maxHeight: 900,
    backgroundColor: color.landingPrimary,
    opacity: 0.34,
  },
  blobTwo: {
    bottom: '-24%',
    right: '-16%',
    width: '58vw',
    height: '58vw',
    maxWidth: 820,
    maxHeight: 820,
    backgroundColor: color.accentOrange,
    opacity: 0.22,
  },
  /* The app itself, shown whole across the whole viewport rather than as a
     framed tile: no border, no radius, no shadow — a wall rather than an
     object. It sits just off the focal plane, so the copy still reads first.
     A plane pushed to `translateZ(-120)` under a 1200px perspective renders at
     1200 / 1320 — about 91% — which is where the strips of bare ground down
     each side came from. The scale puts back exactly what the depth took. */
  wall: {
    position: 'absolute',
    inset: 0,
    transform: 'translateZ(-120px) scale(1.14)',
    willChange: 'transform',
    filter: { default: 'blur(9px)', [media.md]: 'blur(9px)' },
    opacity: { default: 0.78, [media.md]: 0.78 },
  },
  /* A wash over the whole scene: the copy has to stay first, and the tiles are
     a room the copy stands in rather than the thing being read. Thin enough
     that the app behind still reads as an app — every band of copy sits on its
     own frosted panel, so the wash only has to carry the heads and the hero.
     A phone keeps more of it: there the copy sits nearer the room, and no panel
     is wide enough to hold it off. */
  veil: {
    position: 'absolute',
    inset: 0,
    backgroundColor: color.surface3,
    opacity: { default: 0.9, [media.md]: 0.9 },
  },
});

/**
 * The page's backdrop: the app, held still behind the whole document.
 *
 * V5 and V7 move their rooms — depths parting as the page scrolls, layers
 * leaning towards the pointer. This one does not move at all. There is no rAF
 * loop, no scroll listener and no pointer listener in this file: the scene is
 * a fixed pane the document passes in front of, and its only job is to be
 * there. Nothing here has to be held still for a reader who asked for less
 * motion, because nothing here was ever moving.
 *
 * The perspective and the `translateZ` stay: they are what put the app behind
 * the copy rather than under it, and depth reads as depth in a still frame too.
 */
export function ParallaxScene({ shot }: { shot: string }) {
  const plate = usePlate();
  const compact = useCompactPlate();

  return (
    <div {...stylex.props(styles.scene)} aria-hidden>
      <div {...stylex.props(styles.stage)}>
        <div {...stylex.props(styles.blob, styles.blobOne)} />
        <div {...stylex.props(styles.blob, styles.blobTwo)} />

        <div {...stylex.props(styles.wall)}>
          {plate ? (
            <SceneClip />
          ) : (
            <PlateSkeleton
              frame={[showcasePlate.frame, compact && showcasePlate.compactFrame]}
              tone="dark"
              description={shot}
            />
          )}
        </div>
      </div>

      <div {...stylex.props(styles.veil)} />
    </div>
  );
}
