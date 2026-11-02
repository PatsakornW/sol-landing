'use client';

import { useId, useRef, useState, type RefObject } from 'react';
import { AppConfig } from '@/configs/configs';
import { AnimatePresence, m as motion } from 'motion/react';
import { translations } from '@/v5/i18n/messages';
import { BRAND_FILLS } from '@/v5/components/brand/BrandMark';
import { dissolveText } from '@/v5/components/landing/dissolveText';
import { HugeiconsIcon, CheckIcon, ArrowRightIcon, GiftIcon, TelegramIcon } from '@/v5/lib/icons';
import { isEmail, joinWaitlist } from '@/v5/lib/waitlist';

type Status = 'idle' | 'submitting' | 'done' | 'invalid' | 'failed';

// The line under the pill in each state but `done`, which names the email.
const NOTE: Record<Exclude<Status, 'done'>, string> = {
  idle: 'note',
  submitting: 'submitting',
  invalid: 'invalid',
  failed: 'failed',
};

const swap = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] as const },
};

/**
 * The waitlist: one pill holding the email field and its button, over a line
 * that carries the note, the progress and any error. On submit the email
 * dissolves and drifts off in the mark's blue (dissolveText) while the request
 * runs; then the pill becomes a "you're on the list" pill of the same size and
 * the line under it says where the email will go. If the request fails, the
 * email fades back in. Once signed up, two cards follow: the way into the
 * Telegram group and a word on the affiliate programme. `id` is the anchor the
 * header and section buttons jump to.
 */
export function WaitlistForm({ id }: { id: string }) {
  const t = translations('waitlist');
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const { status, dissolving, submit, clearError } = useSignUp(inputRef, canvasRef);
  const [clip, trackClip] = useClipEnds();

  const busy = status === 'submitting';
  const error = status === 'invalid' || status === 'failed';
  const message = status === 'done' ? t('successBody', { email: email.trim() }) : t(NOTE[status]);

  return (
    <div className="waitlist" id={id}>
      {/* One height for both states, so swapping them never moves the page. */}
      <div className="waitlist__slot">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'done' ? (
            <motion.div className="waitlist__done" key="done" {...swap}>
              <span className="waitlist__check" aria-hidden="true">
                <HugeiconsIcon icon={CheckIcon} size={16} strokeWidth={2.4} />
              </span>
              {t('success')}
            </motion.div>
          ) : (
            <motion.form
              className="waitlist__form"
              key="form"
              onSubmit={(event) => {
                event.preventDefault();
                void submit(email);
              }}
              noValidate
              {...swap}
            >
              <div
                className="waitlist__group"
                data-invalid={error || undefined}
                data-dissolving={dissolving || undefined}
                data-clip-start={clip.start || undefined}
                data-clip-end={clip.end || undefined}
              >
                <label className="sr-only" htmlFor={inputId}>
                  {t('label')}
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  className="waitlist__input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t('placeholder')}
                  value={email}
                  readOnly={busy}
                  aria-invalid={status === 'invalid'}
                  aria-describedby={statusId}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError();
                    trackClip(event.target);
                  }}
                  onScroll={(event) => trackClip(event.currentTarget)}
                  onFocus={(event) => trackClip(event.currentTarget)}
                  onBlur={(event) => trackClip(event.currentTarget)}
                />
                <canvas className="waitlist__dissolve" ref={canvasRef} aria-hidden="true" />
                <SubmitButton label={t('button')} busy={busy} />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <p id={statusId} className={`waitlist__note${error ? ' is-error' : ''}`} aria-live="polite">
        {status === 'done' && <span className="sr-only">{t('success')} </span>}
        {message}
      </p>
      <AnimatePresence initial={false}>
        {status === 'done' && (
          <motion.div
            className="waitlist__next"
            key="next"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <a className="waitlist__card waitlist__card--tg" href={AppConfig.social.telegram.url} target="_blank" rel="noopener noreferrer">
              <span className="waitlist__card-icon" aria-hidden="true">
                <HugeiconsIcon icon={TelegramIcon} size={20} strokeWidth={1.8} />
              </span>
              <span className="waitlist__card-text">
                <b>{t('next.telegram.title')}</b>
                <span>{t('next.telegram.body')}</span>
              </span>
              <span className="waitlist__card-go">
                {t('next.telegram.cta')}
                <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2} />
              </span>
            </a>
            <div className="waitlist__card">
              <span className="waitlist__card-icon waitlist__card-icon--aff" aria-hidden="true">
                <HugeiconsIcon icon={GiftIcon} size={20} strokeWidth={1.8} />
              </span>
              <span className="waitlist__card-text">
                <b>{t('next.affiliate.title')}</b>
                <span>{t('next.affiliate.body')}</span>
              </span>
              <a className="waitlist__card-go" href={AppConfig.social.telegram.url} target="_blank" rel="noopener noreferrer">
                {t('next.affiliate.cta')}
                <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The sign-up request. The email dissolves off the field while it runs (the
 * canvas draws the text before the input hides its own), and the result shows
 * once both are done.
 */
function useSignUp(
  inputRef: RefObject<HTMLInputElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [status, setStatus] = useState<Status>('idle');
  const [dissolving, setDissolving] = useState(false);

  const submit = async (email: string) => {
    if (status === 'submitting') return;
    if (!isEmail(email)) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    const input = inputRef.current;
    const canvas = canvasRef.current;
    const dissolved =
      input && canvas ? dissolveText(input, canvas, BRAND_FILLS.front) : Promise.resolve();
    setDissolving(true);
    try {
      await joinWaitlist(email.trim());
      await dissolved;
      setStatus('done');
    } catch {
      await dissolved;
      setStatus('failed');
    } finally {
      setDissolving(false);
    }
  };

  // Editing the email clears an error; it leaves any other state alone.
  const clearError = () => {
    if (status === 'invalid' || status === 'failed') setStatus('idle');
  };

  return { status, dissolving, submit, clearError };
}

/**
 * Which ends of a long email the field has scrolled out of view, so the CSS
 * can fade them where the field would cut them.
 */
function useClipEnds() {
  const [clip, setClip] = useState({ start: false, end: false });
  const track = (input: HTMLInputElement) => {
    const start = input.scrollLeft > 0;
    const end = input.scrollLeft + input.clientWidth < input.scrollWidth - 1;
    setClip((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  };
  return [clip, track] as const;
}

function SubmitButton({ label, busy }: { label: string; busy: boolean }) {
  return (
    <button
      type="submit"
      className="btn btn--primary waitlist__submit"
      disabled={busy}
      aria-busy={busy}
    >
      <span className="waitlist__label">{label}</span>
      {busy ? (
        <span className="waitlist__spinner" aria-hidden="true" />
      ) : (
        <HugeiconsIcon
          className="waitlist__arrow"
          icon={ArrowRightIcon}
          size={18}
          strokeWidth={2}
        />
      )}
    </button>
  );
}
