'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { t7 } from '../i18n/messages';
import { TELEGRAM_URL, type Desk } from '../lib/content';
import { ArrowRight, Check, Close, Gift, Telegram } from './Icons';
import { lockScroll } from './Smooth';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long the mock request takes. */
const MOCK_MS = 1200;

type Phase = 'idle' | 'sending' | 'done';

/**
 * The waitlist sheet, with the desks picked on the page above. The button
 * shows the request: a spinner while it is "sent", then a tick and the success
 * line, and then the way into the Telegram group and a word on the affiliate
 * programme. PLACEHOLDER: there is no waitlist backend yet, so the wait is a timer
 * and the address is stored and sent nowhere.
 */
export function JoinDialog({ open, picked, onClose }: { open: boolean; picked: Desk[]; onClose: () => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    input.current?.focus();
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
    <div className={`sheet sheet--join${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-hidden={!open} inert={!open}>
      <div className="sheet__panel" data-lenis-prevent>
        <button type="button" className="sheet__close" onClick={onClose} aria-label={t7('join.close')}>
          <Close />
        </button>
        <p className="eyebrow">{t7('cta.eyebrow')}</p>
        <h2 className="join__title" id={`${id}-t`}>
          {t7('cta.title')}
        </h2>
        <div className="join__picked">
          <p>{t7('join.picked')}</p>
          {picked.length ? (
            <ul>
              {picked.map((k) => (
                <li key={k}>{t7(`categories.${k}.name`)}</li>
              ))}
            </ul>
          ) : (
            <p className="join__none">{t7('join.none')}</p>
          )}
        </div>
        <form
          className="join__form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (phase !== 'idle') return;
            const value = email.trim();
            if (!EMAIL.test(value)) {
              setNote({ text: t7('waitlist.invalid'), error: true });
              return;
            }
            setNote(null);
            setPhase('sending');
            timer.current = window.setTimeout(() => {
              setPhase('done');
              setNote({ text: t7('waitlist.successBody').replace('{email}', value), error: false });
            }, MOCK_MS);
          }}
        >
          <label htmlFor={`${id}-e`} className="sr-only">
            {t7('waitlist.label')}
          </label>
          <input
            ref={input}
            id={`${id}-e`}
            type="email"
            placeholder={t7('waitlist.placeholder')}
            autoComplete="email"
            value={email}
            disabled={phase !== 'idle'}
            aria-invalid={note?.error || undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (note?.error) setNote(null);
            }}
          />
          <button type="submit" className={`pill pill--accent join__submit is-${phase}`} aria-disabled={phase !== 'idle'}>
            {phase === 'sending' ? (
              <>
                <span className="join__spin" aria-hidden="true" />
                {t7('waitlist.submitting')}
              </>
            ) : phase === 'done' ? (
              <>
                <Check />
                {t7('waitlist.success')}
              </>
            ) : (
              t7('waitlist.button')
            )}
          </button>
        </form>
        <p className={note?.error ? 'join__note join__note--error' : 'join__note'} role="status">
          {note?.text ?? t7('waitlist.note')}
        </p>
        {phase === 'done' ? (
          <div className="join__next">
            <a className="join__card join__card--tg" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <span className="join__icon" aria-hidden="true">
                <Telegram />
              </span>
              <span className="join__text">
                <b>{t7('join.telegram.title')}</b>
                <span>{t7('join.telegram.body')}</span>
              </span>
              <span className="join__go">
                {t7('join.telegram.cta')}
                <ArrowRight />
              </span>
            </a>
            <div className="join__card join__card--aff">
              <span className="join__icon" aria-hidden="true">
                <Gift />
              </span>
              <span className="join__text">
                <b>{t7('join.affiliate.title')}</b>
                <span>{t7('join.affiliate.body')}</span>
              </span>
              <a className="join__go" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                {t7('join.affiliate.cta')}
                <ArrowRight />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
