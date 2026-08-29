'use client';

import { AnimatePresence, m as motion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import { PressButton } from '@/components/landing/PressButton';
import { WaitlistDarkForm } from '@/components/landing/Waitlist';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { ArrowUpRightIcon, HugeiconsIcon, XIcon } from '@/lib/icons';
import { exitFallbackMs, spring } from '@/lib/springs';
import { onDark } from '@/styles/themes';
import { media } from '../../styles/breakpoints.stylex';
import { color, font, shadow } from '../../styles/tokens.stylex';

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 90,
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    paddingTop: 'max(16px, env(safe-area-inset-top, 0px))',
    paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
    paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
    backgroundColor: 'rgba(10, 10, 10, 0.72)',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 16, [media.maxSm]: 14 },
    width: 'min(100%, 520px)',
    margin: 'auto',
    padding: { default: 28, [media.maxSm]: 22 },
    backgroundColor: color.boardPlate,
    borderRadius: 3,
    boxShadow: `${shadow.surface5}, inset 0 0 0 1px rgba(255, 255, 255, 0.07)`,
    color: color.boardInk,
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: color.accentOrange,
      outlineOffset: 3,
    },
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 12,
    display: 'grid',
    placeItems: 'center',
    width: 44,
    height: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: 'rgba(255, 255, 255, 0.09)' },
    },
    color: {
      default: color.boardInkDim,
      ':hover': { default: null, [media.hover]: color.boardInk },
    },
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '0.12s',
    transitionTimingFunction: 'ease',
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: color.accentOrange,
      outlineOffset: 2,
    },
  },
  title: {
    margin: 0,
    minWidth: 0,
    paddingRight: 48,
    paddingBottom: '0.08em',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(36px, 6vw, 52px)',
    lineHeight: 0.94,
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    color: color.boardInk,
  },
  titleLine: {
    display: 'block',
  },
  titleLineFollow: {
    paddingTop: '0.14em',
  },
  titleMuted: {
    color: 'rgba(246, 246, 243, 0.82)',
  },
  body: {
    margin: 0,
    maxWidth: '46ch',
    fontSize: 15,
    lineHeight: 1.7,
    letterSpacing: '-0.01em',
    color: color.boardInkDim,
    textWrap: 'pretty',
    fontFamily: font.mono,
  },
  perk: {
    display: 'inline',
    paddingInline: '0.32em',
    paddingBlock: '0.18em',
    borderRadius: 2,
    backgroundColor: '#C9A227',
    color: '#1A1408',
    boxDecorationBreak: 'clone',
  },
  notice: {
    margin: 0,
    fontSize: 10,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    color: 'rgba(246, 246, 243, 0.38)',
    fontFamily: font.mono,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    display: 'grid',
    minHeight: 49,
    marginTop: 6,
  },
  labelFull: {
    display: { default: null, [media.maxSm]: 'none' },
  },
  labelCompact: {
    display: { default: 'none', [media.maxSm]: 'inline' },
  },
});

export type AccessLabels = {
  /** Full trigger label; the bar swaps to `triggerShort` when it gets tight. */
  trigger: string;
  triggerShort: string;
  close: string;
  title: string;
  titleAccent: string;
  body: string;
  perk: string;
  notice: string;
};

/**
 * The hero bar's access chip, and the modal it opens.
 *
 * It used to be an anchor to `#access` — the close section at the foot of the
 * page, which carries its own waitlist. Scrolling a reader past every other
 * section to reach the form is the long way round for someone who has already
 * decided, so the ask is lifted into a modal and the close section keeps its own
 * copy of the form for readers who arrive there by scrolling. Both mount
 * `WaitlistDarkForm`, and each instance owns its state (see `Waitlist.tsx`), so
 * the two never mirror each other.
 *
 * Portalled to `document.body` rather than rendered in place: `.hero__bar` sets
 * `translate` for its entrance transition, and a non-`none` translate makes an
 * element a containing block for `position: fixed` descendants — the overlay
 * would be trapped inside the bar and clipped by it.
 */
export function AccessDialog({ labels }: { labels: AccessLabels }) {
  const [open, setOpen] = useState(false);
  /**
   * Outlives `open` by the length of the exit fade. The lock has to be released on
   * the frame the overlay is actually gone, not the frame the dismissal starts: let
   * it go early and the page's scrollbar comes back while the scrim is still
   * standing, which shifts the board sideways under a dialog that is mid-dissolve —
   * the open-time jump this whole effect exists to prevent, played backwards.
   */
  const [locked, setLocked] = useState(false);
  // Portals need a DOM; the server render and the first client render must agree,
  // so nothing is portalled until after mount.
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    // Send the caret back where it came from — a dismissed dialog must not drop
    // keyboard focus onto <body>. `preventScroll` because focusing an element is
    // also a scroll-into-view request: the chip lives in the hero bar at the very
    // top of the document, so without it, dismissing the dialog yanks the page up
    // to the top from wherever the reader was.
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEscapeKey(close, open);

  // `onExitComplete` releases the lock on the right frame, but it is an animation
  // callback: a backgrounded or throttled tab can stall the tween and never fire
  // it, which would leave the page unscrollable with no dialog on it — far worse
  // than the shift the deferred release exists to avoid. `exitFallbackMs` is the
  // repo's token for exactly this guard.
  useEffect(() => {
    if (open || !locked) return;
    const timer = window.setTimeout(() => setLocked(false), exitFallbackMs(spring.moderate));
    return () => window.clearTimeout(timer);
  }, [open, locked]);

  // Move focus into the panel once it is on screen. `preventScroll` for the same
  // reason as the trigger, and it matters more here: the panel is `position: fixed`
  // and already centred in the viewport, so the scroll a plain `focus()` asks for
  // can only move the page underneath it — measured as a jump from 750 to 0.
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() =>
      panelRef.current?.focus({ preventScroll: true }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  // Hold the page still for as long as the overlay is on screen.
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const { body } = document;

    // Taking the page's overflow away takes its scrollbar with it, and where that
    // scrollbar is a classic one (Chrome and Firefox on Windows/Linux, ~15px) the
    // layout is handed those 15px back the instant the dialog opens: the whole
    // board — a 100svh hero with a right-anchored nav — jumps sideways behind the
    // scrim. Pay the gutter back as padding in the same frame and nothing moves.
    // Zero on overlay-scrollbar platforms (macOS, iOS, Android), so the branch
    // costs those nothing.
    const gutter = window.innerWidth - root.clientWidth;

    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    // Both elements. `body` alone is the form that usually gets written, and it
    // does work on desktop — the viewport takes its overflow from the body while
    // the root's is `visible`. iOS Safari is the one that keeps scrolling the
    // document anyway. Neither lock disturbs the scroll offset (measured: 750 held
    // across both), so there is nothing to save and restore.
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPaddingRight;
    };
  }, [locked]);

  return (
    <>
      <PressButton
        ref={triggerRef}
        type="button"
        variant="access"
        tone="accent"
        onClick={() => {
          setLocked(true);
          setOpen(true);
        }}
        title={labels.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span {...stylex.props(styles.labelFull)}>{labels.trigger}</span>
        <span {...stylex.props(styles.labelCompact)}>{labels.triggerShort}</span>
        <HugeiconsIcon icon={ArrowUpRightIcon} size={14} strokeWidth={2.5} />
      </PressButton>

      {mounted &&
        createPortal(
          <AnimatePresence onExitComplete={() => setLocked(false)}>
            {open && (
              <motion.div
                {...stylex.props(styles.overlay)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: spring.moderate.exit }}
                transition={spring.moderate}
                onClick={close}
              >
                <motion.div
                  ref={panelRef}
                  {...stylex.props(onDark, styles.panel)}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  tabIndex={-1}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6, transition: spring.moderate.exit }}
                  transition={spring.moderate}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    {...stylex.props(styles.close)}
                    onClick={close}
                    aria-label={labels.close}
                  >
                    <HugeiconsIcon icon={XIcon} size={18} strokeWidth={2} />
                  </button>
                  <h2 id={titleId} {...stylex.props(styles.title)}>
                    <span {...stylex.props(styles.titleLine)}>{labels.title}</span>
                    <span
                      {...stylex.props(styles.titleLine, styles.titleLineFollow, styles.titleMuted)}
                    >
                      {labels.titleAccent}
                    </span>
                  </h2>
                  <p {...stylex.props(styles.body)}>
                    {labels.body} <mark {...stylex.props(styles.perk)}>{labels.perk}</mark>
                  </p>
                  <div {...stylex.props(styles.actions)}>
                    <WaitlistDarkForm tone="accent" layout="dialog" />
                  </div>
                  <p {...stylex.props(styles.notice)}>{labels.notice}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
