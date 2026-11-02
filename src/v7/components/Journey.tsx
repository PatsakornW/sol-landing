'use client';

import { useEffect, useRef, useState } from 'react';
import { t7 } from '../i18n/messages';
import { FEATURES, icon3d } from '../lib/content';
import { DESKTOP, gsap } from '../lib/motion';

/**
 * The platform block. On wide screens it is a pinned scene: a full-bleed card
 * shrinks to the middle of a white page while the lead and the four claims
 * come in either side, then the card's icon changes with each claim as the page
 * scrolls on. Narrower screens stack the card, whose icon cycles on its own,
 * the lead, and the claims as tiles, each with its icon.
 */
export function Journey() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    const card = media.current;
    if (!el || !card) return;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const stage = card.parentElement!;
      const box = (wf: number, hf: number, topf: number | null) => ({
        width: () => stage.clientWidth * wf,
        height: () => stage.clientHeight * hf,
        left: () => (stage.clientWidth * (1 - wf)) / 2,
        top: () => (topf === null ? (stage.clientHeight * (1 - hf)) / 2 + stage.clientHeight * 0.04 : stage.clientHeight * topf),
      });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const p = st.progress;
            el.dataset.nav = p < 0.08 ? 'dark' : 'light';
            setActive(p < 0.5 ? 0 : Math.min(FEATURES.length - 1, Math.floor(((p - 0.5) / 0.5) * FEATURES.length)));
          },
        },
      });
      tl.to(card, { ...box(0.58, 0.74, null), borderRadius: 20, duration: 0.3 }, 0)
        .to('.journey__title', { autoAlpha: 0, y: -20, duration: 0.12 }, 0.02)
        .to(card, { ...box(0.297, 0.58, 0.21), borderRadius: 18, duration: 0.15 }, 0.3)
        .fromTo(['.journey__intro', '.journey__list'], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.33)
        .to({}, { duration: 0.55 }, 0.45);
      return () => {
        el.dataset.nav = 'dark';
      };
    });

    // Without the scroll scene, the card's icon walks through the claims by itself.
    mm.add('(max-width: 1023px)', () => {
      const id = window.setInterval(() => setActive((a) => (a + 1) % FEATURES.length), 2600);
      return () => window.clearInterval(id);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="journey" id="platform" data-nav="dark">
      <div className="journey__stage">
        <div className="journey__intro">
          <p className="eyebrow">{t7('features.eyebrow')}</p>
          <p className="journey__lead">{t7('features.subtitle')}</p>
        </div>

        <div ref={media} className="journey__media">
          <div className="journey__icons" aria-hidden="true">
            {FEATURES.map((f, i) => (
              <img key={f.key} className={i === active ? 'is-on' : undefined} src={icon3d(f.icon)} alt="" />
            ))}
          </div>
          <h2 className="journey__title">{t7('features.title')}</h2>
        </div>

        <ul className="journey__list">
          {FEATURES.map((f, i) => (
            <li key={f.key} className={i === active ? 'is-on' : undefined}>
              <img className="journey__icon" src={icon3d(f.icon)} alt="" loading="lazy" />
              <b>{t7(`features.${f.key}.title`)}</b>
              <span>{t7(`features.${f.key}.desc`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
