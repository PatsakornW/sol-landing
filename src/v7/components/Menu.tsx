'use client';

import { useEffect, useRef } from 'react';
import { BrandMark } from '../brand';
import { t7 } from '../i18n/messages';
import { Close } from './Icons';
import { lockScroll } from './Smooth';

/** The footer's "More" links, as section and label key. */
const MORE = [
  ['#platform', 'footer.platform'],
  ['#how', 'footer.how'],
  ['#faq', 'nav.faq'],
] as const;

/**
 * The menu: a white sheet that drops over the page with the footer's "More"
 * links — each closes the sheet and takes the page to its section — and the
 * waitlist button, set apart in the accent.
 */
export function Menu({ open, onClose, onGo, onJoin }: { open: boolean; onClose: () => void; onGo: (hash: string) => void; onJoin: () => void }) {
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  return (
    <div className={`sheet sheet--menu${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label={t7('menu.title')} aria-hidden={!open} inert={!open}>
      <div className="sheet__panel" data-lenis-prevent>
        <header className="sheet__head">
          <BrandMark className="sheet__mark" />
          <nav className="sheet__nav" aria-label={t7('footer.more')}>
            {MORE.map(([hash, key]) => (
              <button key={hash} type="button" onClick={() => onGo(hash)}>
                {t7(key)}
              </button>
            ))}
          </nav>
          <button type="button" className="pill pill--accent sheet__join" onClick={onJoin} aria-haspopup="dialog">
            {t7('nav.waitlist')}
          </button>
          <button ref={close} type="button" className="sheet__close" onClick={onClose} aria-label={t7('join.close')}>
            <Close />
          </button>
        </header>
      </div>
    </div>
  );
}
