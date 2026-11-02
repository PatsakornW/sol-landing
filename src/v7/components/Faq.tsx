'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { t7 } from '../i18n/messages';
import { FAQ_KEYS } from '../lib/content';
import { pad, ScrollTrigger } from '../lib/motion';
import { ChevronDown } from './Icons';
import { scrollToTarget } from './Smooth';

/**
 * The questions, pinned for a stretch of scroll: each step opens the next
 * answer, and only after the last does the page move on. A click on a question
 * opens that answer at once and scrolls to its step — the steps it glides
 * past stay shut — so clicking and scrolling always agree. When an open
 * answer would run off a short screen, the list slides up to keep it in view.
 */
export function Faq() {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState(0);
  // Set while a click glides the page to a step, so the steps on the way do not open.
  const jumping = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        if (!jumping.current) setOpen(Math.min(FAQ_KEYS.length - 1, Math.floor(s.progress * FAQ_KEYS.length)));
      },
    });
    return () => st.kill();
  }, []);

  // Once the answer has opened, slide the list up if it now runs off screen.
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    // Measured inside the pinned stage (offsets ignore the transform), so it
    // holds wherever the page is scrolled.
    const t = window.setTimeout(() => {
      const stage = ol.parentElement;
      if (!stage) return;
      const over = ol.offsetTop + ol.offsetHeight - (stage.clientHeight - 24);
      ol.style.transform = over > 0 ? `translateY(${-over}px)` : '';
    }, 560);
    return () => window.clearTimeout(t);
  }, [open]);

  const goTo = (i: number) => {
    setOpen(i);
    const st = ScrollTrigger.getAll().find((s) => s.trigger === root.current);
    if (!st) return;
    jumping.current = true;
    const done = () => {
      jumping.current = false;
    };
    scrollToTarget(st.start + ((st.end - st.start) * (i + 0.5)) / FAQ_KEYS.length, done);
    // A wheel or touch can cut the glide short, and then it never reports arriving.
    window.setTimeout(done, 1800);
  };

  return (
    <section ref={root} className="faq" id="faq" data-nav="light">
      <div className="faq__stage">
        <div className="faq__intro">
          <p className="eyebrow">{t7('faq.eyebrow')}</p>
          <h2 className="faq__title">{t7('faq.title')}</h2>
          <p className="faq__lead">
            {t7('faq.lead')} <a href="#contact">{t7('faq.cta')}</a>
          </p>
          <p className="faq__count" aria-hidden="true">
            <b>{pad(open + 1)}</b> / {pad(FAQ_KEYS.length)}
          </p>
        </div>
        <ol ref={list} className="faq__list">
          {FAQ_KEYS.map((k, i) => {
            const on = open === i;
            const body = `${id}-${i}`;
            return (
              <li key={k} className={on ? 'is-open' : undefined}>
                <button type="button" className="faq__q" aria-expanded={on} aria-controls={body} onClick={() => goTo(i)}>
                  <span className="faq__num">{pad(i + 1)}</span>
                  <span className="faq__text">{t7(`faq.${k}.q`)}</span>
                  <span className="faq__chev">
                    <ChevronDown />
                  </span>
                </button>
                <div className="faq__a" id={body}>
                  <div>
                    <p>{t7(`faq.${k}.a`)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
