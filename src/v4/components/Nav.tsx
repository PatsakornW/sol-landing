'use client';

import { useEffect, useState } from 'react';
import { BRAND } from '../brand';
import { t4 } from '../i18n/messages';
import { Btn } from './Btn';
import { Close, Plus, Spark } from './Icons';

export const LINKS = ['main', 'how', 'markets', 'live', 'faq', 'contact'] as const;
export type LinkKey = (typeof LINKS)[number];

/**
 * The header. On a wide screen: the spark and the name at the top left and,
 * under them, a glass panel listing the sections — open over the hero, folded
 * to "Menu +" once the page moves, and opened again by a click. On a tablet or
 * a phone: the name and a round button that opens the sections as a full panel.
 */
export function Nav({ onGo, onJoin }: { onGo: (key: LinkKey) => void; onJoin: () => void }) {
  const [top, setTop] = useState(true);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = window.scrollY < 120;
      setTop(now);
      if (now) setOpen(false);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheet(false);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('is-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
    };
  }, [sheet]);

  const go = (k: LinkKey) => {
    setOpen(false);
    setSheet(false);
    onGo(k);
  };
  const expanded = top || open;

  return (
    <>
      <header className="nav">
        <button type="button" className="nav__brand" onClick={() => go('main')}>
          <span className="nav__spark">
            <Spark />
          </span>
          {BRAND.toUpperCase()}
        </button>
        <div className={expanded ? 'nav__panel is-open' : 'nav__panel'}>
          <button type="button" className="nav__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={expanded} aria-controls="v4-links">
            {t4('nav.menu')}
            <Plus />
          </button>
          <ul className="nav__links" id="v4-links">
            {LINKS.map((k) => (
              <li key={k}>
                <button type="button" tabIndex={expanded ? 0 : -1} onClick={() => go(k)}>
                  {t4(`nav.links.${k}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="nav__burger" onClick={() => setSheet(true)} aria-expanded={sheet} aria-controls="v4-sheet" aria-label={t4('nav.menu')}>
          <i />
          <i />
        </button>
      </header>
      <div className={sheet ? 'navsheet is-open' : 'navsheet'} id="v4-sheet" role="dialog" aria-modal="true" aria-label={t4('nav.menu')} aria-hidden={!sheet} inert={!sheet}>
        <button type="button" className="navsheet__close" onClick={() => setSheet(false)} aria-label={t4('nav.close')}>
          <Close />
        </button>
        <span className="navsheet__spark" aria-hidden="true">
          <Spark />
        </span>
        <ul>
          {LINKS.map((k, i) => (
            <li key={k} style={{ ['--i' as string]: i }}>
              <button type="button" onClick={() => go(k)}>
                {t4(`nav.links.${k}`)}
              </button>
            </li>
          ))}
        </ul>
        <Btn
          className="navsheet__join"
          dialog
          onClick={() => {
            setSheet(false);
            onJoin();
          }}
        >
          {t4('nav.join')}
        </Btn>
      </div>
    </>
  );
}
