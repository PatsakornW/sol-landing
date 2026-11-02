'use client';

import { useRef } from 'react';
import { t7 } from '../i18n/messages';
import { useDiscs } from '../lib/use-discs';

/** The opening card: the disc still life, with the headline along the bottom. */
export function Hero({ onReady }: { onReady: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useDiscs(canvas, 'hero', { onReady });
  return (
    <section className="card hero" id="top" data-nav="dark">
      <canvas ref={canvas} className="card__canvas" aria-hidden="true" />
      <h1 className="hero__title">
        <span>{t7('hero.title')}</span>
      </h1>
    </section>
  );
}
