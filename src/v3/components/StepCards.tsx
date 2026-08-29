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
import { color } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

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
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.md]: 'repeat(3, minmax(0, 1fr))',
    },
    gap: { default: 16, [media.sm]: 24 },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  /* Each step is a pane of the same glass as the feature cards, with the clip
     inset in it rather than framed by it. */
  step: {
    display: 'grid',
    gridTemplateRows: 'auto auto auto 1fr',
    gap: 14,
    padding: { default: 16, [media.sm]: 20 },
    borderRadius: GLASS.panel,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 45%, transparent)`,
    backdropFilter: GLASS.blur,
    WebkitBackdropFilter: GLASS.blur,
    minWidth: 0,
  },
  plate: {
    borderRadius: GLASS.inner,
    overflow: 'hidden',
    backgroundColor: color.surface2,
    minWidth: 0,
  },
  num: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: GLASS.pill,
    backgroundColor: color.fg,
    color: color.background,
    fontSize: 13.5,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  title: {
    margin: 0,
    fontSize: { default: 18, [media.sm]: 20 },
    fontWeight: 700,
    lineHeight: 1.22,
    letterSpacing: '-0.025em',
    color: color.fg,
  },
  desc: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.62,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
});

/**
 * The three steps, each on its own pane.
 *
 * The clips and their crops are the shipped page's; one clock drives all three
 * and each pane clamps its own read of it, because three cards each running an
 * rAF loop meant three React commits per frame.
 */
export function StepCards({ steps }: { steps: readonly Step[] }) {
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
            <span {...stylex.props(styles.num)}>{index + 1}</span>
            <h3 {...stylex.props(styles.title)}>{step.title}</h3>
            <p {...stylex.props(styles.desc)}>{step.desc}</p>
          </li>
        );
      })}
    </ol>
  );
}
