'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PlateSkeleton } from '@/components/motion/PlateSkeleton';
import { FLOW_DURATION, FLOW_FPS } from '@/components/motion/mechanism/flow-timing.stylex';
import { mechanismPlate } from '@/components/motion/mechanism/mechanism-plate.styles';
import { useRevealed } from '@/lib/hooks/use-revealed';
import { usePlate, usePlayOnceFrame, usePrefersReducedMotion } from '@/lib/remotion';
import { media } from '../../styles/breakpoints.stylex';
import { color, font } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const MechanismPlate = dynamic(() => import('@/components/motion/mechanism/MechanismPlate'), {
  ssr: false,
  loading: () => <PlateSkeleton frame={mechanismPlate.frame} tone="paper" />,
});

/** Frames between one step starting and the next — reads as a sequence. */
const STAGGER = 12;

export type Step = { title: string; desc: string; shot: string };

const styles = stylex.create({
  row: {
    display: 'grid',
    /* Same reason as the clip: the plates carry their own proportions. */
    alignSelf: 'center',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.sm]: 'repeat(3, minmax(0, 1fr))',
    },
    gap: { default: 16, [media.sm]: 20 },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  step: {
    display: 'grid',
    gap: 10,
    alignContent: 'start',
    minWidth: 0,
  },
  plate: {
    borderRadius: STAGE.frame,
    overflow: 'hidden',
    backgroundColor: color.surface2,
    minWidth: 0,
  },
  head: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    margin: 0,
  },
  num: {
    fontFamily: font.mono,
    fontSize: 11.5,
    letterSpacing: '0.1em',
    color: color.landingPrimary,
    fontVariantNumeric: 'tabular-nums',
  },
  title: {
    margin: 0,
    fontSize: { default: 17, [media.sm]: 19 },
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    color: color.fg,
  },
  titleOn: {
    /* Light in both palettes — see `Stage.invert`. */
    color: '#f5f7fb',
  },
  desc: {
    margin: 0,
    fontSize: 14.5,
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  descOn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

/**
 * The mechanism, three shots across one stage.
 *
 * The clips and their crops are the shipped page's; one clock drives all three
 * and each step clamps its own read of it, because three cards each running an
 * rAF loop meant three React commits per frame.
 */
export function StageSteps({
  steps,
  invert = false,
}: {
  steps: readonly Step[];
  invert?: boolean;
}) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const revealed = useRevealed(listRef);
  const plate = usePlate();
  const reducedMotion = usePrefersReducedMotion();

  const frame = usePlayOnceFrame(FLOW_DURATION + STAGGER * (steps.length - 1), FLOW_FPS, {
    start: revealed && plate,
    animate: !reducedMotion,
  });

  return (
    <ol ref={listRef} {...stylex.props(styles.row)}>
      {steps.map((step, index) => {
        const stepFrame = Math.min(FLOW_DURATION - 1, Math.max(0, frame - index * STAGGER));
        return (
          <li key={step.title} {...stylex.props(styles.step)}>
            <div {...stylex.props(styles.plate)}>
              {plate ? (
                <MechanismPlate index={index + 1} frame={stepFrame} />
              ) : (
                <PlateSkeleton frame={mechanismPlate.frame} tone="paper" description={step.shot} />
              )}
            </div>
            <div {...stylex.props(styles.head)}>
              <span {...stylex.props(styles.num)}>{String(index + 1).padStart(2, '0')}</span>
              <h3 {...stylex.props(styles.title, invert && styles.titleOn)}>{step.title}</h3>
            </div>
            <p {...stylex.props(styles.desc, invert && styles.descOn)}>{step.desc}</p>
          </li>
        );
      })}
    </ol>
  );
}
