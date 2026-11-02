'use client';

import { useEffect, useRef, useState } from 'react';
import { BRAND, BrandMark } from '../brand';
import { t8 } from '../i18n/messages';

/** Every section the header links to, in page order. */
export const LINKS = ['how', 'price', 'flow', 'vault', 'markets', 'faq'] as const;
export type LinkKey = (typeof LINKS)[number] | 'top';

/**
 * The fixed header over every scene, across the full width: the mark and the
 * name at the left, a link to every section in the middle with the one in view
 * lit, and the waitlist button at the right. On smaller screens the links fold
 * into a hamburger at the far right, after the waitlist button, which opens
 * them as a list. On the stage it scrolls away as the footer comes up.
 */
export function Chrome({ active, onGo, onJoin }: { active: LinkKey; onGo: (key: LinkKey) => void; onJoin: () => void }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="chrome">
      <nav className="nav" aria-label={BRAND}>
        <button type="button" className="nav__brand" onClick={() => onGo('top')}>
          <span className="nav__mark" aria-hidden="true">
            <BrandMark />
          </span>
          <span className="nav__name">{BRAND}</span>
        </button>
        <ul className="nav__links">
          {LINKS.map((k) => (
            <li key={k}>
              <button type="button" className={k === active ? 'nav__link is-on' : 'nav__link'} aria-current={k === active ? 'true' : undefined} onClick={() => onGo(k)}>
                {t8(`nav.links.${k}`)}
              </button>
            </li>
          ))}
        </ul>
        <div className="nav__end">
          <button type="button" className="nav__join" onClick={onJoin} aria-haspopup="dialog">
            {t8('nav.join')}
          </button>
          <div className={open ? 'nav__menu is-open' : 'nav__menu'} ref={menu}>
            <button type="button" className="nav__burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="v8-menu" aria-label={open ? t8('nav.close') : t8('nav.menu')}>
              <i />
              <i />
              <i />
            </button>
            <ul className="nav__list" id="v8-menu">
              {LINKS.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    className={k === active ? 'is-on' : undefined}
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      setOpen(false);
                      onGo(k);
                    }}
                  >
                    {t8(`nav.links.${k}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
