'use client';

import { useCallback, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { HugeiconsIcon, MenuIcon } from '@/lib/icons';
import { media } from '../../styles/breakpoints.stylex';
import { useScrollFrame } from '../hooks/use-scroll-frame';
import { bp, V3 } from '../styles/eclipse.stylex';
import { AccessDialog, type AccessLabels } from './AccessDialog';
import { Brand } from './Brand';
import { Btn } from './Buttons';
import type { FormLabels } from './DemoForm';
import { useReady } from './Ready';

const styles = stylex.create({
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBlock: 18,
    paddingInline: V3.gutter,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
    opacity: { default: 0, [media.noScript]: 1, [media.reduce]: 1 },
    translate: { default: '0 -12px', [media.noScript]: '0 0', [media.reduce]: '0 0' },
    transitionProperty: 'opacity, translate, padding, background-color, border-color',
    transitionDuration: { default: '1s, 1s, 0.5s, 0.5s, 0.5s', [media.reduce]: '1ms' },
    transitionDelay: { default: '2.4s, 2.4s, 0s, 0s, 0s', [media.reduce]: '0s' },
    transitionTimingFunction: `ease, ${V3.ease}, ${V3.ease}, ease, ease`,
  },
  barOn: {
    opacity: 1,
    translate: '0 0',
  },
  /* Once the page has moved, the bar takes a ground and a hairline. */
  barScrolled: {
    paddingBlock: 11,
    backgroundColor: 'rgba(3, 3, 9, 0.6)',
    backdropFilter: 'blur(16px) saturate(150%)',
    WebkitBackdropFilter: 'blur(16px) saturate(150%)',
    borderBottomColor: V3.line,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    display: { default: 'inline-block', [bp.max720]: 'none' },
    paddingBlock: 9,
    paddingInline: 15,
    borderRadius: V3.pill,
    textDecorationLine: 'none',
    color: { default: V3.dust, ':hover': V3.star },
    backgroundColor: { default: 'transparent', ':hover': 'rgba(239, 237, 250, 0.07)' },
    fontSize: 15,
    fontWeight: 500,
    transitionProperty: 'color, background-color',
    transitionDuration: '0.3s',
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
  access: {
    height: 42,
    paddingInline: 18,
    fontSize: 14.5,
    marginLeft: { default: 10, [bp.max720]: 0 },
  },
  long: {
    display: { default: 'inline', [bp.max720]: 'none' },
  },
  short: {
    display: { default: 'none', [bp.max720]: 'inline' },
  },
  menuButton: {
    display: { default: 'none', [bp.max720]: 'grid' },
    placeItems: 'center',
    width: 42,
    height: 42,
    padding: 0,
    marginLeft: 8,
    borderWidth: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 237, 250, 0.07)',
    color: V3.star,
    cursor: 'pointer',
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
  panel: {
    position: 'fixed',
    top: 70,
    right: V3.gutter,
    zIndex: 61,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 200,
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 10, 29, 0.94)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  panelLink: {
    paddingBlock: 12,
    paddingInline: 14,
    borderRadius: 10,
    textDecorationLine: 'none',
    color: V3.star,
    backgroundColor: { default: 'transparent', ':hover': 'rgba(239, 237, 250, 0.07)' },
  },
});

export type NavLabels = {
  primary: string;
  how: string;
  faq: string;
  menu: string;
  /** Every section, for the phone menu. */
  sections: readonly { id: string; label: string }[];
  access: AccessLabels;
  form: FormLabels;
};

/**
 * The fixed bar: brand on the left, two links and the access button on the
 * right, and under 720px a menu button that drops a panel of every section.
 */
export function Nav({ homeHref, labels }: { homeHref: string; labels: NavLabels }) {
  const ready = useReady();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);
  useScrollFrame(onFrame);

  const closeAccess = useCallback(() => {
    setAccessOpen(false);
    triggerRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header {...stylex.props(styles.bar, ready && styles.barOn, scrolled && styles.barScrolled)}>
        <Brand href={homeHref} />
        <nav {...stylex.props(styles.links)} aria-label={labels.primary}>
          <a href="#mechanism" {...stylex.props(styles.link)}>
            {labels.how}
          </a>
          <a href="#faq" {...stylex.props(styles.link)}>
            {labels.faq}
          </a>
          <div ref={triggerRef} style={{ display: 'contents' }}>
            <Btn
              tone="sun"
              arrow
              style={styles.access}
              onClick={() => setAccessOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={accessOpen}
            >
              <span {...stylex.props(styles.long)}>{labels.access.trigger}</span>
              <span {...stylex.props(styles.short)}>{labels.access.triggerShort}</span>
            </Btn>
          </div>
          <button
            type="button"
            {...stylex.props(styles.menuButton)}
            aria-label={labels.menu}
            aria-expanded={menuOpen}
            aria-controls="v3-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <HugeiconsIcon icon={MenuIcon} size={18} strokeWidth={2} />
          </button>
        </nav>
      </header>

      {menuOpen ? (
        <div id="v3-menu" {...stylex.props(styles.panel)}>
          {labels.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              {...stylex.props(styles.panelLink)}
              onClick={() => setMenuOpen(false)}
            >
              {section.label}
            </a>
          ))}
        </div>
      ) : null}

      <AccessDialog
        open={accessOpen}
        onClose={closeAccess}
        labels={labels.access}
        form={labels.form}
      />
    </>
  );
}
