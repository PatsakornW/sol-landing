'use client';

import { AnimatePresence, m as motion } from 'motion/react';
import { createContext, use, useEffect, useRef, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { PressButton } from '@/components/landing/PressButton';
import { InputField, InputGroup } from '@/components/ui/input-group';
import { AppConfig } from '@/configs/configs';
import { hugeicon } from '@/lib/hugeicon';
import { ArrowUpRightIcon, HugeiconsIcon, InfoIcon, MailIcon } from '@/lib/icons';
import { spring } from '@/lib/springs';
import { media } from '../../styles/breakpoints.stylex';
import { color, font, shadow, space } from '../../styles/tokens.stylex';

const mailIcon = hugeicon(MailIcon);

type WaitlistStage = 'idle' | 'entering' | 'joined';
type WaitlistLabels = {
  confirm: string;
  email: string;
  joined: string;
  join: string;
  invalid: string;
  docs: string;
};

const styles = stylex.create({
  form: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    width: '100%',
    minHeight: space.waitlistSlot,
  },
  formInvalid: {
    paddingBottom: 24,
  },
  cell: {
    gridArea: '1 / 1',
  },
  cta: {
    justifySelf: 'start',
    paddingBottom: 5,
  },
  /* For callers whose whole band is centred — the button is the only thing in
     the grid's single column, so its own `justifySelf` is what decides, not
     the parent's text alignment. */
  ctaCenter: {
    justifySelf: 'center',
  },
  ctaStretch: {
    justifySelf: { default: null, [media.maxSm]: 'stretch' },
  },
  row: {
    display: 'flex',
    flexDirection: { default: null, [media.maxSm]: 'column' },
    flexWrap: { default: 'wrap', [media.maxSm]: 'nowrap' },
    alignItems: { default: 'flex-end', [media.maxSm]: 'stretch' },
    gap: 10,
    maxWidth: 460,
    width: '100%',
  },
  /**
   * The dialog is narrow at every width, so it keeps the one-row layout the
   * phone breakpoint above would otherwise stack.
   *
   * Each property restates its base value as well as its phone value. A
   * property-level condition set is one unit when styles merge — the later
   * style replaces the whole set, not just the condition it names — so an
   * override that mentions only the query would drop the base with it.
   */
  rowDialog: {
    flexDirection: { default: null, [media.maxSm]: 'row' },
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    maxWidth: 'none',
  },
  rowHero: {
    maxWidth: 'none',
  },
  confirm: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    // Same 5px the press key uses for its depth slab, so this column is 49px
    // and the email field can share that box — bottoms line up with the slab,
    // not with the face sitting 5px above it.
    paddingBottom: 5,
    alignSelf: { default: 'flex-end', [media.maxSm]: 'stretch' },
    width: { default: null, [media.maxSm]: '100%' },
  },
  confirmDialog: {
    alignSelf: 'flex-end',
    width: { default: null, [media.maxSm]: 'auto' },
  },
  joined: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 10,
    minHeight: 47,
    height: 'auto',
    maxWidth: '100%',
    paddingInline: 16,
    paddingBlock: 8,
    borderRadius: 3,
    backgroundColor: color.surface3,
    boxShadow: shadow.surface2,
  },
  check: {
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    color: color.success,
  },
  joinedText: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1.35,
    letterSpacing: '-0.015em',
    color: '#fff',
    fontFamily: font.mono,
    minWidth: 0,
    textWrap: 'pretty',
  },
  joinedLink: {
    color: '#9fc2ff',
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
  },
});

const WaitlistContext = createContext<WaitlistLabels | null>(null);

export function WaitlistProvider({
  labels,
  children,
}: {
  labels: WaitlistLabels;
  children: ReactNode;
}) {
  return <WaitlistContext value={labels}>{children}</WaitlistContext>;
}

export function WaitlistDarkForm({
  tone = 'brand',
  layout = 'page',
  stretchIdle = false,
  align = 'start',
}: {
  tone?: 'brand' | 'accent';
  layout?: 'page' | 'dialog' | 'hero';
  stretchIdle?: boolean;
  /** Where the idle button sits in the form's column. Defaults to the left. */
  align?: 'start' | 'center';
}) {
  const labels = use(WaitlistContext);
  if (!labels) throw new Error('Waitlist controls must be rendered inside WaitlistProvider');

  const [stage, setStage] = useState<WaitlistStage>('idle');
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const confirm = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setInvalid(!valid);
    if (valid) setStage('joined');
  };

  useEffect(() => {
    if (stage !== 'entering') return;
    const frame = window.requestAnimationFrame(() =>
      fieldRef.current?.querySelector('input')?.focus({ preventScroll: true }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  if (stage === 'joined') {
    return (
      <motion.div
        {...stylex.props(styles.joined)}
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={spring.moderate}
      >
        <span {...stylex.props(styles.check)} aria-hidden="true">
          <HugeiconsIcon icon={InfoIcon} size={18} strokeWidth={2} />
        </span>
        <span {...stylex.props(styles.joinedText)}>
          {labels.joined}{' '}
          <a
            href={AppConfig.docsUrl}
            target="_blank"
            rel="noreferrer"
            {...stylex.props(styles.joinedLink)}
          >
            {labels.docs} ↗
          </a>
        </span>
      </motion.div>
    );
  }

  return (
    <form
      {...stylex.props(styles.form, invalid && styles.formInvalid)}
      onSubmit={(event) => {
        event.preventDefault();
        if (stage === 'idle') setStage('entering');
        else confirm();
      }}
      noValidate
    >
      <AnimatePresence mode="sync" initial={false}>
        {stage === 'idle' ? (
          <motion.div
            key="idle"
            {...stylex.props(
              styles.cell,
              styles.cta,
              align === 'center' && styles.ctaCenter,
              stretchIdle && styles.ctaStretch,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: spring.fast.exit }}
            transition={spring.fast}
          >
            <PressButton type="submit" variant="primary" tone={tone} blockNarrow={stretchIdle}>
              {labels.join} <HugeiconsIcon icon={ArrowUpRightIcon} size={13} strokeWidth={2.5} />
            </PressButton>
          </motion.div>
        ) : (
          <motion.div
            key="entering"
            {...stylex.props(
              styles.cell,
              styles.row,
              layout === 'dialog' && styles.rowDialog,
              layout === 'hero' && styles.rowHero,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: spring.fast.exit }}
            transition={spring.moderate}
          >
            <InputGroup chrome="waitlist" layout={layout === 'dialog' ? 'dialog' : 'page'}>
              <InputField
                ref={fieldRef}
                index={0}
                label={labels.email}
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setInvalid(false);
                }}
                icon={mailIcon}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@email.com"
                required
                error={invalid ? labels.invalid : undefined}
              />
            </InputGroup>
            <span {...stylex.props(styles.confirm, layout === 'dialog' && styles.confirmDialog)}>
              <PressButton
                type="submit"
                variant="primary"
                tone={tone}
                blockNarrow={layout !== 'dialog'}
              >
                {labels.confirm}{' '}
                <HugeiconsIcon icon={ArrowUpRightIcon} size={13} strokeWidth={2.5} />
              </PressButton>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
