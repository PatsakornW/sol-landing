'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PlateSkeleton } from '@/components/motion/PlateSkeleton';
import { HOME_DURATION, HOME_FPS } from '@/components/motion/showcase/home-timing.stylex';
import { showcasePlate } from '@/components/motion/showcase/showcase-plate.styles';
import { useRevealed } from '@/lib/hooks/use-revealed';
import { useShowcaseNews } from '@/lib/hooks/use-showcase-news';
import {
  useCompactPlate,
  usePlate,
  usePlayOnceFrame,
  usePrefersReducedMotion,
} from '@/lib/remotion';
import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const ShowcasePlate = dynamic(() => import('@/components/motion/showcase/ShowcasePlate'), {
  ssr: false,
  loading: () => <PlateSkeleton frame={showcasePlate.frame} tone="dark" />,
});

const styles = stylex.create({
  /* On a stage the clip is the shot: as wide as the measure allows, framed
     only enough to keep its corners off the ground. */
  frame: {
    margin: 0,
    /* The stage's body stretches; a clip has an aspect ratio and would only
       gain a grey band by stretching with it. */
    alignSelf: 'center',
    /* No width cap: on a stage the clip is the shot, so it runs the full
       measure rather than sitting in a 900px window inside it. */
    width: '100%',
    borderRadius: STAGE.frame,
    overflow: 'hidden',
    backgroundColor: color.surface2,
    minWidth: 0,
  },
  caption: {
    margin: 0,
    marginTop: 12,
    paddingInlineStart: { default: 12, [media.sm]: 16 },
    maxWidth: '52ch',
    fontSize: { default: 13.5, [media.sm]: 14.5 },
    lineHeight: 1.55,
    color: color.mutedFg,
  },
  captionOn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

/** The app clip, at stage scale. */
export function StageClip({
  caption,
  shot,
  invert = false,
}: {
  caption: string;
  shot: string;
  invert?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const revealed = useRevealed(ref);
  const plate = usePlate();
  const compact = useCompactPlate();
  const reducedMotion = usePrefersReducedMotion();
  const { news, headline } = useShowcaseNews();

  const frame = usePlayOnceFrame(HOME_DURATION, HOME_FPS, {
    start: revealed && plate,
    animate: !reducedMotion,
  });

  return (
    <figure ref={ref} {...stylex.props(styles.frame)}>
      {plate ? (
        <ShowcasePlate
          frame={frame}
          compact={compact}
          news={news}
          headline={headline}
          revealed={revealed}
        />
      ) : (
        <PlateSkeleton
          frame={[
            showcasePlate.frame,
            compact && showcasePlate.compactFrame,
            showcasePlate.enter,
            revealed && showcasePlate.revealed,
          ]}
          tone="dark"
          description={shot}
        />
      )}
      <figcaption {...stylex.props(styles.caption, invert && styles.captionOn)}>
        {caption}
      </figcaption>
    </figure>
  );
}
