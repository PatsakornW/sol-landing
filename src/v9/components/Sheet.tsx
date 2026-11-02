'use client';

import { useEffect, useId, useState } from 'react';
import { t9 } from '../i18n/messages';
import { DESK_ICON, icon3d } from './Fly';
import { Close, Plus } from './Icons';
import { lockScroll } from './Smooth';

export type SheetKey = 'how' | 'platform' | 'markets' | 'faq';

const FEATURES = ['onchain', 'instant', 'noncustodial', 'oracle'] as const;
const FEATURE_ICON = { onchain: 'usdc', instant: 'bolt', noncustodial: 'key', oracle: 'gavel' } as const;
const DESKS = ['crypto', 'politics', 'sports', 'culture', 'tech', 'economy'] as const;
const FAQ = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

function How() {
  return (
    <>
      <p className="sheet__lead">{t9('sheets.how.lead')}</p>
      <div className="sheet__grid sheet__grid--two">
        {(['a', 'b'] as const).map((k) => (
          <div key={k} className="sheet__card">
            <h3>{t9(`sheets.how.points.${k}.q`)}</h3>
            <p>{t9(`sheets.how.points.${k}.a`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Platform() {
  return (
    <>
      <p className="sheet__lead">{t9('sheets.platform.lead')}</p>
      <div className="sheet__grid">
        {FEATURES.map((k) => (
          <div key={k} className="sheet__card">
            <img className="sheet__icon" src={icon3d(FEATURE_ICON[k])} alt="" />
            <p className="sheet__label">{t9(`sheets.platform.items.${k}.label`)}</p>
            <h3>{t9(`sheets.platform.items.${k}.title`)}</h3>
            <p>{t9(`sheets.platform.items.${k}.desc`)}</p>
            <dl className="sheet__facts">
              {(['a', 'b', 'c'] as const).map((f) => (
                <div key={f}>
                  <dt>{t9(`sheets.platform.items.${k}.facts.${f}.label`)}</dt>
                  <dd>{t9(`sheets.platform.items.${k}.facts.${f}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}

function Markets() {
  return (
    <>
      <p className="sheet__lead">{t9('sheets.markets.lead')}</p>
      <div className="sheet__grid sheet__grid--three">
        {DESKS.map((k) => (
          <div key={k} className="sheet__card sheet__card--desk">
            <img className="sheet__icon" src={icon3d(DESK_ICON[k])} alt="" />
            <h3>{t9(`sheets.markets.names.${k}`)}</h3>
            <p>{t9(`sheets.markets.q.${k}`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Faq() {
  const [open, setOpen] = useState<string | null>('q1');
  const id = useId();
  return (
    <>
      <p className="sheet__lead">{t9('sheets.faq.lead')}</p>
      <ul className="sheet__faq">
        {FAQ.map((k) => {
          const on = open === k;
          return (
            <li key={k} className={on ? 'is-open' : undefined}>
              <button type="button" aria-expanded={on} aria-controls={`${id}-${k}`} onClick={() => setOpen(on ? null : k)}>
                {t9(`sheets.faq.items.${k}.q`)}
                <Plus />
              </button>
              <div className="sheet__answer" id={`${id}-${k}`} role="region">
                <p>{t9(`sheets.faq.items.${k}.a`)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const BODIES: Record<SheetKey, () => React.ReactNode> = { how: How, platform: Platform, markets: Markets, faq: Faq };

/**
 * A sheet that rises over the page with one subject in V5's words: how a
 * price works, the platform's four claims, the six desks, or the questions.
 * The scene pills, the menu and the footer open it.
 */
export function Sheet({ open, onClose, onJoin }: { open: SheetKey | null; onClose: () => void; onJoin: () => void }) {
  const id = useId();
  const [shown, setShown] = useState<SheetKey>('how');

  useEffect(() => {
    if (open) setShown(open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open, onClose]);

  const Body = BODIES[shown];
  return (
    <div className={`sheet sheet--${shown}${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-hidden={!open} inert={!open}>
      <button type="button" className="sheet__scrim" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div className="sheet__panel" data-lenis-prevent>
        <button type="button" className="sheet__close" onClick={onClose} aria-label={t9('sheets.close')}>
          <Close />
        </button>
        <p className="sheet__eyebrow">{t9(`sheets.${shown}.eyebrow`)}</p>
        <h2 className="sheet__title" id={`${id}-t`}>
          {t9(`sheets.${shown}.title`)}
        </h2>
        <Body />
        <button
          type="button"
          className="pill pill--blue sheet__join"
          onClick={() => {
            onClose();
            onJoin();
          }}
        >
          {t9('nav.waitlist')}
        </button>
      </div>
    </div>
  );
}
