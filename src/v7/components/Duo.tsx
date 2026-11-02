'use client';

import { useEffect, useRef } from 'react';
import { t7 } from '../i18n/messages';
import { ScrollTrigger } from '../lib/motion';
import { useDiscs } from '../lib/use-discs';

/**
 * Two statements: one in white on pink, one in black on white, with discs
 * tumbling across the seam between them as the page scrolls.
 */
export function Duo() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useDiscs(canvas, 'fall', { lazy: true });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (s) => stage.current?.setProgress(s.progress),
    });
    return () => st.kill();
  }, [stage]);

  return (
    <div ref={root} className="duo">
      <section className="duo__a" data-nav="dark">
        <h2 className="duo__big rv">{t7('duo.a')}</h2>
      </section>
      <section className="duo__b" data-nav="light">
        <h2 className="duo__big rv">{t7('duo.b')}</h2>
      </section>
      <div className="duo__fall" aria-hidden="true">
        <canvas ref={canvas} />
      </div>
    </div>
  );
}
