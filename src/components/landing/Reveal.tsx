'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useRevealed } from '@/lib/hooks/use-revealed';
import { media, motion } from '../../styles/breakpoints.stylex';

const styles = stylex.create({
  /* A stage is a full screen the reader arrives at, one at a time. Its rows
     rise into place when it does — small, and once: the latch in `useRevealed`
     never unlatches, so scrolling back up does not rewind the page into an
     animation nobody asked to see twice. */
  /* A reader who asked for less motion still gets the content — they get it
     already in place, with nothing to travel. Each property carries that
     condition itself: StyleX takes conditions per property, never a style
     object under a media key. */
  row: {
    opacity: { default: 0, [media.reduce]: 1 },
    translate: { default: '0 22px', [media.reduce]: '0 0' },
    transitionProperty: 'opacity, translate',
    transitionDuration: { default: '620ms', [media.reduce]: '1ms' },
    transitionTimingFunction: motion.ease,
  },
  on: {
    opacity: 1,
    translate: '0 0',
  },
});

/**
 * How far apart the rows of one section arrive, in milliseconds.
 *
 * Small enough that the section reads as one thing settling rather than as three
 * things queueing: past about 150ms between rows the eye starts following each
 * one separately and the headline stops being the first thing read.
 */
const STEP = 90;

const wait = stylex.create({
  delay: (index: number) => ({ transitionDelay: `${index * STEP}ms` }),
});

/**
 * One row of a section, revealed when the section is.
 *
 * A client island rather than a client section: the observer is the only thing
 * here that needs the browser, and passing the rows through as children keeps
 * every word of them server-rendered.
 */
export function Reveal({
  index = 0,
  immediate = false,
  style,
  children,
}: {
  /** Position in the stage, which is what its delay is derived from. */
  index?: number;
  /**
   * Reveal on mount rather than on arrival.
   *
   * For the opening screen, which the reader does not arrive at — they are
   * already there. Its rows also sit low in the frame, inside the band
   * `useRevealed` deliberately holds back, so an observer would leave the call
   * to action invisible until the reader scrolled past the thing it is asking
   * them not to scroll past.
   */
  immediate?: boolean;
  /** The layout role the row plays in its section — passed in, since the
      section owns its own layout. */
  style?: StyleXStyles;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const revealed = useRevealed(ref);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!immediate) return undefined;
    /* One frame later, so the row paints hidden first and the transition has
       something to travel from. */
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [immediate]);

  const on = immediate ? mounted : revealed;

  return (
    <div ref={ref} {...stylex.props(styles.row, on && styles.on, wait.delay(index), style)}>
      {children}
    </div>
  );
}
