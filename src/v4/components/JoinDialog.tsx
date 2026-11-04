'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useKeyboardAvoid } from '@/hooks/useKeyboardAvoid';
import { AppConfig } from '@/configs/configs';
import { BrandMark } from '../brand';
import { t4 } from '../i18n/messages';
import { ArrowRight, Check, Close, Gift, Telegram } from './Icons';
import { lockScroll } from './Smooth';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long the mock request takes. */
const MOCK_MS = 1200;

const TELEGRAM_URL = AppConfig.social.telegram.url;

type Phase = 'idle' | 'sending' | 'done';

/**
 * The waitlist, as a glass panel over the page. The button shows the request:
 * a spinner while it is "sent", then a tick and the success line, and then the
 * way into the Telegram group and a word on the affiliate programme.
 * PLACEHOLDER: there is no waitlist backend yet, so the wait is a timer and the
 * address is stored and sent nowhere.
 */
export function JoinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // On a phone the keyboard covers the lower screen; keep the sheet in what is left.
  useKeyboardAvoid(root, open);

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
    <div ref={root} className={`join${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} aria-hidden={!open} inert={!open}>
      <button type="button" className="join__scrim" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div className="join__panel" data-lenis-prevent>
        <button type="button" className="join__close" onClick={onClose} aria-label={t4('waitlist.close')}>
          <Close />
        </button>
        <span className="join__mark" aria-hidden="true">
          <BrandMark />
        </span>
        <p className="join__eyebrow">{t4('waitlist.eyebrow')}</p>
        <h2 className="join__title" id={`${id}-t`}>
          {t4('waitlist.title')}
        </h2>
        <form
          className="join__form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (phase !== 'idle') return;
            const value = email.trim();
            if (!EMAIL.test(value)) {
              setNote({ text: t4('waitlist.invalid'), error: true });
              return;
            }
            setNote(null);
            setPhase('sending');
            timer.current = window.setTimeout(() => {
              setPhase('done');
              setNote({ text: t4('waitlist.successBody').replace('{email}', value), error: false });
            }, MOCK_MS);
          }}
        >
          <label htmlFor={`${id}-e`} className="sr-only">
            {t4('waitlist.label')}
          </label>
          <input
            ref={input}
            id={`${id}-e`}
            type="email"
            placeholder={t4('waitlist.placeholder')}
            autoComplete="email"
            value={email}
            disabled={phase !== 'idle'}
            aria-invalid={note?.error || undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (note?.error) setNote(null);
            }}
          />
          <button type="submit" className={`btn join__submit is-${phase}`} aria-disabled={phase !== 'idle'}>
            {phase === 'sending' ? (
              <>
                <span className="join__spin" aria-hidden="true" />
                {t4('waitlist.submitting')}
              </>
            ) : phase === 'done' ? (
              <>
                <Check />
                {t4('waitlist.success')}
              </>
            ) : (
              t4('waitlist.button')
            )}
          </button>
        </form>
        <p className={note?.error ? 'join__note join__note--error' : 'join__note'} role="status">
          {note?.text ?? t4('waitlist.note')}
        </p>
        {phase === 'done' ? (
          <div className="join__next">
            <a className="join__card join__card--tg" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <span className="join__icon" aria-hidden="true">
                <Telegram />
              </span>
              <span className="join__text">
                <b>{t4('waitlist.telegram.title')}</b>
                <span>{t4('waitlist.telegram.body')}</span>
              </span>
              <span className="join__go">
                {t4('waitlist.telegram.cta')}
                <ArrowRight />
              </span>
            </a>
            <div className="join__card join__card--aff">
              <span className="join__icon" aria-hidden="true">
                <Gift />
              </span>
              <span className="join__text">
                <b>{t4('waitlist.affiliate.title')}</b>
                <span>{t4('waitlist.affiliate.body')}</span>
              </span>
              <a className="join__go" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                {t4('waitlist.affiliate.cta')}
                <ArrowRight />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
