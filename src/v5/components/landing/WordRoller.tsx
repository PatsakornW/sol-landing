'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import {
  m as motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'motion/react';
import { useHydrated } from '@/v5/hooks/useHydrated';

// Share of the track held still at each end, so the first and last words rest.
const HOLD = 0.12;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A sentence whose subject rolls through a list while the rest stays put (a
 * word-roller pattern, rebuilt here): the section holds the screen, scrolling
 * turns the list a word at a time, and the word on the line lights up. The list is drawn three
 * times over, so words always sit above and below the line and it reads as an
 * endless loop. It comes to rest on the last word, which completes the
 * sentence the section is about.
 *
 * Before hydration, without JavaScript, or with reduced motion, the sentence
 * renders at rest on its last word with no held scroll. Screen readers get
 * the whole sentence once (`sentence`); the roll itself is hidden from them.
 */
export function WordRoller({
  id,
  eyebrow,
  words,
  suffix,
  sentence,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  words: string[];
  suffix: string;
  sentence: string;
  lead: string;
  /** An action under the lead, held on screen with the sentence. */
  children?: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const live = useHydrated() && !reduced;

  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const last = words.length - 1;
  // The list's position, in words: 0 on the first, `last` on the last. At rest
  // (not live) it is the last word outright: a transform only reruns when the
  // scroll changes, which it may not do after hydration.
  // It moves a whole word at a time, springing onto each, so a word is always
  // on the line rather than caught between two.
  const word = useTransform(scrollYProgress, (p) =>
    Math.round(clamp01((p - HOLD) / (1 - 2 * HOLD)) * last),
  );
  const roll = useSpring(word, { stiffness: 260, damping: 30, mass: 0.6 });
  const at = live ? roll : last;

  const loop = [...words, ...words, ...words];

  return (
    <div
      className="roller"
      ref={track}
      data-live={live ? '' : undefined}
      style={{ '--n': words.length } as CSSProperties}
    >
      <div className="roller__stage">
        <p className="sec__eyebrow">{eyebrow}</p>
        <h2 className="roller__sentence" id={id}>
          <span className="sr-only">{sentence}</span>
          <span className="roller__window" aria-hidden="true">
            <motion.span className="roller__list" style={{ '--at': at } as MotionStyle}>
              {loop.map((word, k) => (
                <span className="roller__word" key={k} style={{ '--k': k } as CSSProperties}>
                  {word}
                </span>
              ))}
            </motion.span>
          </span>
          <span className="roller__suffix" aria-hidden="true">
            {suffix}
          </span>
        </h2>
        <p className="roller__lead">{lead}</p>
        {children ? <div className="roller__action">{children}</div> : null}
      </div>
    </div>
  );
}
