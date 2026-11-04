'use client';

import { useId, useState } from 'react';
import { t7 } from '../i18n/messages';
import { FAQ_KEYS } from '../lib/content';
import { pad } from '../lib/motion';
import { ChevronDown } from './Icons';

/**
 * The questions, as a plain accordion in the page's own scroll: every answer
 * starts shut, a click opens that one (and shuts any other), and a second
 * click shuts it again.
 */
export function Faq() {
  const id = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq" id="faq" data-nav="light">
      <div className="faq__stage">
        <div className="faq__intro">
          <p className="eyebrow">{t7('faq.eyebrow')}</p>
          <h2 className="faq__title">{t7('faq.title')}</h2>
          <p className="faq__lead">
            {t7('faq.lead')} <a href="#contact">{t7('faq.cta')}</a>
          </p>
        </div>
        <ol className="faq__list">
          {FAQ_KEYS.map((k, i) => {
            const on = open === i;
            const body = `${id}-${i}`;
            return (
              <li key={k} className={on ? 'is-open' : undefined}>
                <button type="button" className="faq__q" aria-expanded={on} aria-controls={body} onClick={() => setOpen(on ? null : i)}>
                  <span className="faq__num">{pad(i + 1)}</span>
                  <span className="faq__text">{t7(`faq.${k}.q`)}</span>
                  <span className="faq__chev">
                    <ChevronDown />
                  </span>
                </button>
                <div className="faq__a" id={body} aria-hidden={!on} inert={!on}>
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
