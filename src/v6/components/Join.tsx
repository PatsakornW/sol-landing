'use client';

import { useId, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon } from '../lib/assets';
import { bp, C } from '../styles/candy.stylex';
import { Btn, RoundBtn } from './Buttons';
import { Sticker } from './Sticker';

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const rise = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(14px)' } });

const styles = stylex.create({
  section: { position: 'relative', zIndex: 1, backgroundColor: C.plate, color: C.type, paddingTop: 'clamp(80px, 14vh, 160px)', paddingBottom: 'clamp(80px, 12vh, 140px)', paddingInline: C.gutter, overflow: 'hidden', textAlign: 'center' },
  titleWrap: { position: 'relative' },
  title: {
    position: 'relative',
    zIndex: 1,
    margin: 0,
    marginInline: 'auto',
    maxWidth: '12ch',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(48px, 11vw, 176px)',
    lineHeight: 0.92,
    textTransform: 'uppercase',
    color: C.pink,
    textWrap: 'balance',
  },
  /* The slot centres the bell; the bell itself is what GSAP moves, so the
     centring survives the entrance. */
  bellSlot: { position: 'absolute', zIndex: 2, left: '50%', top: '50%', width: 'clamp(120px, 18vw, 280px)', translate: '-50% -55%', pointerEvents: 'none' },
  bell: { display: 'block', width: '100%', height: 'auto', filter: 'drop-shadow(0 30px 40px rgba(28, 24, 48, 0.3))' },
  tag: { position: { default: 'absolute', [bp.max760]: 'static' }, zIndex: 3, left: 'calc(50% + clamp(40px, 8vw, 140px))', top: '62%', display: { default: 'block', [bp.max760]: 'inline-block' }, marginTop: { default: 0, [bp.max760]: 20 }, transform: 'rotate(8deg)' },
  stamp: { position: 'absolute', zIndex: 3, right: 'clamp(8px, 6vw, 120px)', top: 'clamp(240px, 40vh, 520px)', display: { default: 'block', [bp.max991]: 'none' } },
  formWrap: { position: 'relative', zIndex: 4, maxWidth: 600, marginInline: 'auto', marginTop: 'clamp(36px, 7vh, 72px)' },
  pill: { display: 'flex', flexDirection: { default: 'row', [bp.max560]: 'column' }, gap: 8, padding: 8, borderRadius: 18, backgroundColor: C.base },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    minWidth: 0,
    height: 48,
    paddingInline: 16,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: C.plate,
    color: C.type,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 18,
    letterSpacing: '0.02em',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 3,
    outlineColor: C.blue,
    '::placeholder': { color: C.typeSoft },
  },
  note: { margin: 0, marginTop: 12, minHeight: '1.4em', fontFamily: font.sans, fontWeight: 600, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.typeSoft },
  err: { color: C.pinkLight },
  done: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 64, borderRadius: 18, backgroundColor: C.blue, color: C.type, fontFamily: font.display, fontSize: 24, textTransform: 'uppercase' },
  spinner: { flexShrink: 0, width: 16, height: 16, borderRadius: '50%', borderWidth: 2, borderStyle: 'solid', borderColor: 'rgba(255, 255, 255, 0.35)', borderTopColor: '#FFFFFF', animationName: spin, animationDuration: '0.7s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' },
  /* After signing up: the way into the Telegram group and the affiliate note. */
  next: { display: 'grid', gap: 10, marginTop: 24, textAlign: 'left', animationName: rise, animationDuration: '0.5s', animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', animationFillMode: 'both' },
  card: {
    display: 'grid',
    gridTemplateColumns: { default: '44px 1fr auto', [bp.max560]: '44px 1fr' },
    alignItems: 'center',
    gap: 14,
    paddingBlock: 14,
    paddingInline: 14,
    borderRadius: C.radius,
    backgroundColor: C.base,
    color: C.type,
    textDecorationLine: 'none',
  },
  cardTg: { backgroundColor: C.blue, color: '#FFFFFF' },
  cardIcon: { display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.18)', fontSize: 20 },
  cardIconAff: { backgroundColor: C.pink, color: C.base },
  cardText: { display: 'grid', gap: 2, minWidth: 0 },
  cardTitle: { fontFamily: font.sans, fontWeight: 700, fontSize: 16, letterSpacing: '0.02em', textTransform: 'uppercase' },
  cardBody: { fontFamily: font.sans, fontWeight: 500, fontSize: 14, lineHeight: 1.4, opacity: 0.8 },
  cardGo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifySelf: { default: null, [bp.max560]: 'start' },
    gridColumn: { default: null, [bp.max560]: '2' },
    gap: 6,
    height: 36,
    paddingInline: 14,
    borderRadius: 10,
    backgroundColor: C.blue,
    color: '#FFFFFF',
    fontFamily: font.sans,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecorationLine: 'none',
    whiteSpace: 'nowrap',
  },
  cardGoTg: { backgroundColor: '#FFFFFF', color: C.blueDeep },
});

export type JoinLabels = {
  eyebrow: string;
  title: string;
  contact: string;
  contactHref: string;
  form: { label: string; placeholder: string; button: string; submitting: string; note: string; invalid: string; failed: string; success: string; successBody: (email: string) => string };
  /** What follows a sign-up: the Telegram group and the affiliate note. */
  next: { href: string; telegram: NextCard; affiliate: NextCard };
};

type NextCard = { title: string; body: string; cta: string };

const glyph = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Telegram's paper plane, in line. */
function PlaneGlyph() {
  return (
    <svg viewBox="0 0 24 24" {...glyph}>
      <path d="M21 3.5 2.8 10.7l6.6 2.4 2.4 6.9 3.5-4.5 4.9 3.7z" />
      <path d="m9.4 13.1 7.3-5.4" />
    </svg>
  );
}

/** A gift box, in line. */
function GiftGlyph() {
  return (
    <svg viewBox="0 0 24 24" {...glyph}>
      <path d="M3.5 9h17v3.5h-17zM5 12.5v8h14v-8M12 9v11.5" />
      <path d="M12 9c-2.3 0-4.5-1-4.5-2.7 0-1.3 1.2-2 2.2-1.7C11.2 5 12 7 12 9c0-2 .8-4 2.3-4.4 1-.3 2.2.4 2.2 1.7C16.5 8 14.3 9 12 9z" />
    </svg>
  );
}

type Status = 'idle' | 'submitting' | 'done' | 'invalid' | 'failed';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** PLACEHOLDER: no waitlist backend yet — accepts any valid address and stores nothing. */
async function joinWaitlist(email: string) {
  if (!EMAIL.test(email)) throw new Error('invalid-email');
  await new Promise((r) => setTimeout(r, 600));
}

/**
 * The closing shout, with a bell hung over it, the waitlist pill under it and
 * a round stamp to write to the team. The button spins while the sign-up runs;
 * once it is done, the pill turns into the success bar and two cards follow —
 * the Telegram group and the affiliate programme.
 */
export function Join({ labels }: { labels: JoinLabels }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const f = labels.form;
  const busy = status === 'submitting';
  const error = status === 'invalid' || status === 'failed';
  const note = status === 'done' ? f.successBody(email.trim()) : status === 'submitting' ? f.submitting : status === 'invalid' ? f.invalid : status === 'failed' ? f.failed : f.note;

  const submit = async () => {
    if (busy) return;
    if (!EMAIL.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    try {
      await joinWaitlist(email.trim());
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <section id="join" {...stylex.props(styles.section)} aria-labelledby="join-title">
      <div {...stylex.props(styles.titleWrap)}>
        <h2 id="join-title" {...stylex.props(styles.title)} data-reveal="chars" data-stagger="0.5">
          {labels.title}
        </h2>
        <span {...stylex.props(styles.bellSlot)} aria-hidden="true">
          <img src={icon('bell')} alt="" {...stylex.props(styles.bell)} data-reveal="image" data-move="40vh" data-rotate="-30" />
        </span>
        <span {...stylex.props(styles.tag)} data-reveal="slide-rotate" data-rotate="8">
          <Sticker big bg="#DC74EC" fg="#14151D">
            {labels.eyebrow}
          </Sticker>
        </span>
      </div>
      <span {...stylex.props(styles.stamp)}>
        <RoundBtn href={labels.contactHref}>{labels.contact}</RoundBtn>
      </span>
      <div {...stylex.props(styles.formWrap)} data-reveal="up" data-move="40%" data-rotate="0">
        {status === 'done' ? (
          <div {...stylex.props(styles.done)} role="status">
            ✓ {f.success}
          </div>
        ) : (
          <form
            {...stylex.props(styles.pill)}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <label htmlFor={id} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              {f.label}
            </label>
            <input
              id={id}
              {...stylex.props(styles.input)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={f.placeholder}
              value={email}
              readOnly={busy}
              aria-invalid={status === 'invalid'}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setStatus('idle');
              }}
            />
            <Btn type="submit" disabled={busy} aria-busy={busy} icon={busy ? <span {...stylex.props(styles.spinner)} aria-hidden="true" /> : undefined}>
              {busy ? f.submitting : f.button}
            </Btn>
          </form>
        )}
        <p {...stylex.props(styles.note, error && styles.err)} aria-live="polite">
          {note}
        </p>
        {status === 'done' ? (
          <div {...stylex.props(styles.next)}>
            <a href={labels.next.href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.card, styles.cardTg)}>
              <span {...stylex.props(styles.cardIcon)} aria-hidden="true">
                <PlaneGlyph />
              </span>
              <span {...stylex.props(styles.cardText)}>
                <span {...stylex.props(styles.cardTitle)}>{labels.next.telegram.title}</span>
                <span {...stylex.props(styles.cardBody)}>{labels.next.telegram.body}</span>
              </span>
              <span {...stylex.props(styles.cardGo, styles.cardGoTg)}>{labels.next.telegram.cta} →</span>
            </a>
            <div {...stylex.props(styles.card)}>
              <span {...stylex.props(styles.cardIcon, styles.cardIconAff)} aria-hidden="true">
                <GiftGlyph />
              </span>
              <span {...stylex.props(styles.cardText)}>
                <span {...stylex.props(styles.cardTitle)}>{labels.next.affiliate.title}</span>
                <span {...stylex.props(styles.cardBody)}>{labels.next.affiliate.body}</span>
              </span>
              <a href={labels.next.href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.cardGo)}>
                {labels.next.affiliate.cta} →
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
