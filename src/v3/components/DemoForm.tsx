'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { ArrowRightIcon, CheckIcon, GiftIcon, HugeiconsIcon, TelegramIcon } from '@/lib/icons';
import { font } from '../../styles/tokens.stylex';
import { bp, V3 } from '../styles/eclipse.stylex';
import { Btn } from './Buttons';

/** How long the mock request takes. */
const MOCK_MS = 1200;

const TELEGRAM_URL = AppConfig.social.telegram.url;

const spin = stylex.keyframes({
  to: { transform: 'rotate(360deg)' },
});

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'none' },
});

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: { default: 'row', [bp.max520]: 'column' },
    gap: 10,
    marginTop: 18,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    /* 'auto', not 0: when the form stacks, the main axis is the height. */
    flexBasis: 'auto',
    minWidth: 0,
    height: 52,
    paddingBlock: 0,
    paddingInline: 18,
    borderRadius: V3.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: V3.line2, ':focus': 'rgba(255, 227, 179, 0.7)' },
    backgroundColor: 'rgba(3, 3, 9, 0.6)',
    color: V3.star,
    fontFamily: font.sans,
    fontSize: 16,
    outline: 'none',
    boxShadow: { default: null, ':focus': '0 0 0 4px rgba(255, 227, 179, 0.12)' },
    transitionProperty: 'border-color, box-shadow, opacity',
    transitionDuration: '0.3s',
    opacity: { default: 1, ':disabled': 0.6 },
    '::placeholder': {
      color: V3.faint,
    },
  },
  inputError: {
    borderColor: '#ff9fae',
  },
  submit: {
    flexShrink: 0,
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    minWidth: { default: 190, [bp.max520]: 0 },
  },
  sending: {
    cursor: 'progress',
    opacity: 0.85,
  },
  done: {
    cursor: 'default',
    backgroundColor: '#8de0b0',
  },
  spinner: {
    width: 16,
    height: 16,
    flexShrink: 0,
    borderRadius: '50%',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(7, 7, 26, 0.25)',
    borderTopColor: V3.ink,
    animationName: spin,
    animationDuration: '0.7s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  status: {
    margin: 0,
    marginTop: 12,
    minHeight: '1.4em',
    fontSize: 14,
    color: V3.dust,
  },
  statusError: {
    color: '#ff9fae',
  },
  statusOk: {
    color: V3.corona,
  },
  note: {
    margin: 0,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.5,
    color: V3.faint,
  },
  /* After the request: the way into the Telegram group, and the affiliate programme. */
  next: {
    display: 'grid',
    gap: 10,
    marginTop: 16,
    textAlign: 'left',
  },
  card: {
    display: 'grid',
    gridTemplateColumns: { default: '40px 1fr auto', [bp.max520]: '40px 1fr' },
    alignItems: 'center',
    columnGap: 14,
    rowGap: 10,
    paddingBlock: 14,
    paddingInline: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    backgroundColor: 'rgba(239, 237, 250, 0.04)',
    color: V3.star,
    textDecorationLine: 'none',
    animationName: rise,
    animationDuration: '0.6s',
    animationTimingFunction: V3.ease,
    animationFillMode: 'both',
  },
  cardTg: {
    borderColor: 'rgba(30, 105, 246, 0.55)',
    backgroundImage: 'linear-gradient(135deg, rgba(30, 105, 246, 0.38), rgba(30, 105, 246, 0.1))',
  },
  cardAff: {
    animationDelay: '0.12s',
  },
  icon: {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 237, 250, 0.12)',
  },
  iconAff: {
    backgroundColor: 'rgba(220, 116, 236, 0.22)',
    color: '#f2c1f8',
  },
  text: {
    display: 'grid',
    gap: 2,
    minWidth: 0,
  },
  textTitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  textBody: {
    fontSize: 13.5,
    lineHeight: 1.4,
    color: V3.dust,
  },
  go: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingInline: 14,
    borderRadius: V3.pill,
    gridColumnStart: { default: 'auto', [bp.max520]: 2 },
    justifySelf: { default: 'auto', [bp.max520]: 'start' },
    backgroundColor: { default: 'rgba(239, 237, 250, 0.1)', ':hover': 'rgba(239, 237, 250, 0.2)' },
    color: V3.star,
    fontSize: 14,
    fontWeight: 600,
    textDecorationLine: 'none',
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

export type FormLabels = {
  email: string;
  placeholder: string;
  invalid: string;
  submitting: string;
  success: string;
  /** The line under a sent form; `{email}` is the address. */
  successBody: string;
  telegram: { title: string; body: string; cta: string };
  affiliate: { title: string; body: string; cta: string };
};

type Phase = 'idle' | 'sending' | 'done';

/**
 * The email form, as a demonstration of one.
 *
 * A submit checks the address, then shows the request: a spinner while it is
 * "sent", a tick and the success line, and then the way into the Telegram
 * group and a word on the affiliate programme. PLACEHOLDER: there is no
 * waitlist backend yet, and the page says so beside every copy of this form —
 * the wait is a timer and the address is sent nowhere.
 */
export function DemoForm({
  labels,
  submit,
  arrow = false,
  note,
}: {
  labels: FormLabels;
  /** The button's text. */
  submit: string;
  arrow?: boolean;
  /** The small print under the form, which may carry a link. */
  note: ReactNode;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState(false);
  const [sentTo, setSentTo] = useState('');

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      <form
        {...stylex.props(styles.form)}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (phase !== 'idle') return;
          const input = inputRef.current;
          if (!input) return;
          if (!input.value || !input.checkValidity()) {
            setError(true);
            input.focus();
            return;
          }
          setError(false);
          setSentTo(input.value.trim());
          setPhase('sending');
          timer.current = window.setTimeout(() => setPhase('done'), MOCK_MS);
        }}
      >
        <label htmlFor={id} {...stylex.props(styles.srOnly)}>
          {labels.email}
        </label>
        <input
          ref={inputRef}
          id={id}
          {...stylex.props(styles.input, error && styles.inputError)}
          type="email"
          name="email"
          placeholder={labels.placeholder}
          autoComplete="email"
          required
          disabled={phase !== 'idle'}
          aria-invalid={error || undefined}
          onChange={() => {
            if (error) setError(false);
          }}
        />
        <Btn
          tone="sun"
          type="submit"
          arrow={arrow && phase === 'idle'}
          style={[styles.submit, phase === 'sending' && styles.sending, phase === 'done' && styles.done]}
          aria-disabled={phase !== 'idle'}
        >
          {phase === 'sending' ? (
            <>
              <span {...stylex.props(styles.spinner)} aria-hidden="true" />
              {labels.submitting}
            </>
          ) : phase === 'done' ? (
            <>
              <HugeiconsIcon icon={CheckIcon} size={16} strokeWidth={2.4} />
              {labels.success}
            </>
          ) : (
            submit
          )}
        </Btn>
      </form>
      <p {...stylex.props(styles.status, error && styles.statusError, phase === 'done' && styles.statusOk)} role="status">
        {error ? labels.invalid : phase === 'done' ? labels.successBody.replace('{email}', sentTo) : ''}
      </p>
      {phase === 'done' ? (
        <div {...stylex.props(styles.next)}>
          <a {...stylex.props(styles.card, styles.cardTg)} href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            <span {...stylex.props(styles.icon)} aria-hidden="true">
              <HugeiconsIcon icon={TelegramIcon} size={18} strokeWidth={1.8} />
            </span>
            <span {...stylex.props(styles.text)}>
              <b {...stylex.props(styles.textTitle)}>{labels.telegram.title}</b>
              <span {...stylex.props(styles.textBody)}>{labels.telegram.body}</span>
            </span>
            <span {...stylex.props(styles.go)}>
              {labels.telegram.cta}
              <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2.2} />
            </span>
          </a>
          <div {...stylex.props(styles.card, styles.cardAff)}>
            <span {...stylex.props(styles.icon, styles.iconAff)} aria-hidden="true">
              <HugeiconsIcon icon={GiftIcon} size={18} strokeWidth={1.8} />
            </span>
            <span {...stylex.props(styles.text)}>
              <b {...stylex.props(styles.textTitle)}>{labels.affiliate.title}</b>
              <span {...stylex.props(styles.textBody)}>{labels.affiliate.body}</span>
            </span>
            <a {...stylex.props(styles.go)} href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              {labels.affiliate.cta}
              <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      ) : null}
      <p {...stylex.props(styles.note)}>{note}</p>
    </>
  );
}
