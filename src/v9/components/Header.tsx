'use client';

import { useEffect, useState } from 'react';
import { BRAND, BrandMark } from '../brand';
import { t9 } from '../i18n/messages';
import type { SheetKey } from './Sheet';
import { Close } from './Icons';

const LINKS: SheetKey[] = ['how', 'platform', 'markets', 'faq'];

/**
 * The header: the mark and the name at the left; the Join pill and the
 * hamburger at the right, both taking the colour of the scene behind them.
 * The hamburger opens the menu, a full-screen panel of big links that open
 * the page's sheets.
 */
export function Header({ onSheet, onJoin }: { onSheet: (key: SheetKey) => void; onJoin: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('is-menu');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-menu');
    };
  }, [open]);

  return (
    <>
      <header className="head">
        <a className="head__brand" href="#top" aria-label={BRAND}>
          <BrandMark className="head__mark" />
          <span className="head__name">{BRAND}</span>
        </a>
        <div className="head__end">
          <button type="button" className="pill pill--tone head__join" onClick={onJoin} aria-haspopup="dialog">
            {t9('nav.join')}
          </button>
          <button type="button" className="head__burger" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="v9-menu" aria-label={t9('nav.menu')}>
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>
      <div
        className={open ? 'menu is-open' : 'menu'}
        id="v9-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t9('nav.menu')}
        aria-hidden={!open}
        inert={!open}
      >
        <button type="button" className="menu__close" onClick={() => setOpen(false)} aria-label={t9('nav.close')}>
          <Close />
        </button>
        <ul className="menu__list">
          {LINKS.map((k, i) => (
            <li key={k} style={{ ['--i' as string]: i }}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSheet(k);
                }}
              >
                {t9(`nav.links.${k}`)}
              </button>
            </li>
          ))}
          <li style={{ ['--i' as string]: LINKS.length }}>
            <button
              type="button"
              className="menu__join"
              onClick={() => {
                setOpen(false);
                onJoin();
              }}
            >
              {t9('nav.waitlist')}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
