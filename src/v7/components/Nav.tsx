'use client';

import { useEffect, useState } from 'react';
import { BRAND, BrandMark } from '../brand';
import { t7 } from '../i18n/messages';

/** The footer's "More" links, as section and label key. */
const LINKS = [
  ['#platform', 'footer.platform'],
  ['#how', 'footer.how'],
  ['#faq', 'nav.faq'],
] as const;

/**
 * The floating pill: the mark, the footer's "More" links and the waitlist
 * button. On a phone the links give way to the hamburger, which opens the menu
 * sheet. It reads whatever section sits under it — `data-nav="light"` turns it
 * white on white sections, anything else keeps it glassy on colour.
 */
export function Nav({ onMenu, onJoin }: { onMenu: () => void; onJoin: () => void }) {
  const [top, setTop] = useState(true);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const update = () => {
      setTop(window.scrollY < 40);
      const under = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]')).find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= 50 && r.bottom > 50;
      });
      setLight(under?.dataset.nav === 'light');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav className={`nav${light ? ' nav--light' : ''}${top ? ' nav--top' : ''}`} aria-label={BRAND}>
      <a className="nav__mark" href="#top" aria-label={BRAND}>
        <BrandMark />
      </a>
      <ul className="nav__links">
        {LINKS.map(([hash, key]) => (
          <li key={hash}>
            <a className="nav__link" href={hash}>
              {t7(key)}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav__join" type="button" onClick={onJoin} aria-haspopup="dialog">
        {t7('nav.waitlist')}
      </button>
      <button className="nav__menu" type="button" onClick={onMenu} aria-label={t7('nav.menu')} aria-haspopup="dialog">
        <i />
        <i />
        <i />
      </button>
    </nav>
  );
}
