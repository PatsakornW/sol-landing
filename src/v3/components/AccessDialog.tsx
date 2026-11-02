'use client';

import { AnimatePresence, m as motion } from 'motion/react';
import { useEffect, useId, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { HugeiconsIcon, XIcon } from '@/lib/icons';
import { font } from '../../styles/tokens.stylex';
import { V3 } from '../styles/eclipse.stylex';
import { DemoForm, type FormLabels } from './DemoForm';

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 95,
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    overflowY: 'auto',
    backgroundColor: 'rgba(1, 1, 4, 0.72)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  panel: {
    position: 'relative',
    width: 'min(480px, 100%)',
    padding: 'clamp(24px, 4vw, 36px)',
    borderRadius: 26,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    color: V3.star,
    backgroundImage: 'radial-gradient(80% 60% at 50% 0%, rgba(30, 105, 246, 0.18), transparent 70%)',
    backgroundColor: V3.void2,
    boxShadow: '0 40px 120px -30px rgba(0, 0, 0, 0.9)',
    outline: 'none',
  },
  title: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 40,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  body: {
    margin: 0,
    marginTop: 12,
    color: V3.dust,
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    display: 'grid',
    placeItems: 'center',
    width: 38,
    height: 38,
    padding: 0,
    borderWidth: 0,
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: { default: 'rgba(239, 237, 250, 0.07)', ':hover': 'rgba(239, 237, 250, 0.14)' },
    color: V3.star,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
});

export type AccessLabels = {
  trigger: string;
  triggerShort: string;
  title: string;
  body: string;
  submit: string;
  note: string;
  close: string;
};

/**
 * The access request, as a modal over the page.
 *
 * The bar's button opens it; the bar owns that state and gives the caret back
 * to the button when this closes. Escape, the scrim and the corner button all
 * close it. The page is held still underneath while it is up.
 */
export function AccessDialog({
  open,
  onClose,
  labels,
  form,
}: {
  open: boolean;
  onClose: () => void;
  labels: AccessLabels;
  form: FormLabels;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          {...stylex.props(styles.overlay)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            {...stylex.props(styles.panel)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              {...stylex.props(styles.close)}
              onClick={onClose}
              aria-label={labels.close}
            >
              <HugeiconsIcon icon={XIcon} size={16} strokeWidth={2} />
            </button>
            <h2 id={titleId} {...stylex.props(styles.title)}>
              {labels.title}
            </h2>
            <p {...stylex.props(styles.body)}>{labels.body}</p>
            <DemoForm labels={form} submit={labels.submit} note={labels.note} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
