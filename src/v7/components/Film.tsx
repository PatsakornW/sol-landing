'use client';

import { useEffect, useRef, useState } from 'react';
import { rollerWords, t7 } from '../i18n/messages';
import { pad, ScrollTrigger } from '../lib/motion';
import { useDiscs } from '../lib/use-discs';

/**
 * The second card: a close-up of the discs that holds the screen while the
 * page scrolls through V5's roller — "Bitcoin has a price.", "The election has
 * a price." — one subject per step, ending on "Every question has a price."
 * Only after the last one does the waitlist card slide up over it. The scroll
 * length is the spacer after the card (`.pair__hold`).
 */
export function Film() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useDiscs(canvas, 'film', { lazy: true });
  const words = rollerWords();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hold = root.current?.nextElementSibling;
    if (!(hold instanceof HTMLElement)) return;
    // The card is up once the spacer's top meets the bottom of the screen, and
    // the next card starts to cover it once the spacer's bottom does.
    const st = ScrollTrigger.create({
      trigger: hold,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: (s) => setStep(Math.min(words.length - 1, Math.floor(s.progress * words.length))),
    });
    return () => st.kill();
  }, [words.length]);

  return (
    <section ref={root} className="card film" data-nav="dark">
      <canvas ref={canvas} className="card__canvas" aria-hidden="true" />
      <h2 className="film__roll">
        <span className="sr-only">{t7('film.title')}</span>
        <span className="film__words" aria-hidden="true">
          <span className="film__track" style={{ '--n': step } as React.CSSProperties}>
            {words.map((w, i) => (
              <span key={w} className={i === step ? 'is-on' : undefined}>
                {w}
              </span>
            ))}
          </span>
        </span>
        <span className="film__suffix" aria-hidden="true">
          {t7('how.roller.suffix')}
        </span>
      </h2>
      <div className="film__meter" aria-hidden="true">
        <span>
          <b>{pad(step + 1)}</b> / {pad(words.length)}
        </span>
        <span className="film__bar">
          <i style={{ transform: `scaleX(${(step + 1) / words.length})` }} />
        </span>
      </div>
    </section>
  );
}
