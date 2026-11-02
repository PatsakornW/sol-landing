'use client';

import { useEffect, useRef } from 'react';
import { AppConfig } from '@/configs/configs';
import { t7 } from '../i18n/messages';
import { gsap } from '../lib/motion';
import { useDiscs } from '../lib/use-discs';
import { ArrowRight } from './Icons';

/**
 * The closing card: how to reach the team on the left — the line, a word on
 * what to write about, the address and the waitlist — and the mark's discs
 * drifting in a tall oval window on the right.
 */
export function Outro({ onJoin }: { onJoin: () => void }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useDiscs(canvas, 'oval', { lazy: true });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el.querySelector('.outro__oval'),
      { y: 50 },
      { y: -50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={root} className="card outro" id="contact" data-nav="dark">
      <div className="outro__copy">
        <p className="eyebrow eyebrow--light rv">{t7('contact.eyebrow')}</p>
        <h2 className="outro__title rv">{t7('outro.title')}</h2>
        <p className="outro__body rv">{t7('contact.body')}</p>
        <div className="outro__actions rv">
          <a className="pill pill--light" href={`mailto:${AppConfig.email}`}>
            {AppConfig.email}
            <ArrowRight />
          </a>
          <button type="button" className="pill pill--ghost" onClick={onJoin} aria-haspopup="dialog">
            {t7('waitlist.button')}
          </button>
        </div>
      </div>
      <div className="outro__oval">
        <canvas ref={canvas} aria-hidden="true" />
      </div>
    </section>
  );
}
