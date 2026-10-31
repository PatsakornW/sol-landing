'use client';

import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { BrandMark, BrandWordmark } from '@/components/brand/BrandMark';
import { AccessDialog, type AccessLabels } from '@/components/landing/AccessDialog';
import { AppConfig } from '@/configs/configs';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { HugeiconsIcon, MenuIcon, XIcon } from '@/lib/icons';
import { media, motion } from '../../styles/breakpoints.stylex';
import { color, font, space } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const styles = stylex.create({
  /* Fixed and weightless: no bar, no fill, no rule. On a stage the chrome has
     to be reachable without becoming one of the objects on screen — so the
     strip itself ignores the pointer and only the controls take it back. */
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingInline: space.pageInline,
    paddingBlock: { default: 12, [media.sm]: 16 },
    pointerEvents: 'none',
    /* Over the opening shot the strip is nothing but its controls; once the
       page moves under it, it becomes a bar — ground, hairline and a shadow —
       because a stage that alternates light and dark grounds gives floating
       controls nothing reliable to sit on. */
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    boxShadow: 'none',
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: '220ms',
    transitionTimingFunction: motion.ease,
  },
  barLifted: {
    backgroundColor: color.surface3,
    borderBottomColor: color.border,
    boxShadow: '0 10px 30px -18px rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    paddingBlock: 6,
    paddingInline: 12,
    borderRadius: STAGE.pill,
    backgroundColor: color.card,
    color: color.fg,
    textDecorationLine: 'none',
    pointerEvents: 'auto',
  },
  right: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    pointerEvents: 'auto',
  },
  link: {
    display: { default: 'none', [media.md]: 'inline-flex' },
    alignItems: 'center',
    height: 38,
    paddingInline: 14,
    borderRadius: STAGE.pill,
    backgroundColor: color.card,
    fontSize: 14,
    fontWeight: 500,
    color: { default: color.fg, ':hover': { default: null, [media.hover]: color.landingPrimary } },
    textDecorationLine: 'none',
    whiteSpace: 'nowrap',
  },
  burger: {
    display: { default: 'inline-flex', [media.md]: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    padding: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    borderRadius: STAGE.pill,
    backgroundColor: { default: color.card, ':active': color.active },
    color: color.fg,
    cursor: 'pointer',
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': color.ring },
    outlineOffset: { default: null, ':focus-visible': 2 },
  },
  scrim: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: 'rgba(8, 9, 12, 0.55)',
  },
  /* A panel off the left edge rather than a full-screen takeover: it opens
     beside the page instead of replacing it, so the stage behind stays visible
     through the scrim and the reader keeps their place. */
  sheet: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 55,
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    width: 'min(320px, 84vw)',
    paddingInline: space.pageInline,
    paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: color.border,
    backgroundColor: color.surface3,
    boxShadow: '18px 0 48px -28px rgba(0, 0, 0, 0.55)',
    animationName: {
      default: stylex.keyframes({
        from: { translate: '-100% 0' },
        to: { translate: '0 0' },
      }),
      [media.reduce]: 'none',
    },
    animationDuration: '240ms',
    animationTimingFunction: motion.ease,
    overflowY: 'auto',
  },
  /* The drawer's own head: the brand it opened from, and the way out. */
  sheetHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 62,
    paddingBlock: 12,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: color.border,
  },
  sheetBrand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: color.fg,
    textDecorationLine: 'none',
  },
  sheetNav: {
    display: 'grid',
    alignContent: 'start',
    paddingTop: 8,
  },
  sheetLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 56,
    paddingBlock: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: color.border,
    /* Sized for a 320px panel: the full-screen menu's poster type would break
       every one of these onto three lines. */
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.15,
    color: color.fg,
    textDecorationLine: 'none',
  },
  mark: {
    fontFamily: font.mono,
    fontSize: 12,
    letterSpacing: '0.1em',
    color: color.landingPrimary,
  },
});

export type StageNavLabels = {
  navLabel: string;
  how: string;
  faq: string;
  docs: string;
  menu: string;
  close: string;
  access: AccessLabels;
};

/** Weightless chrome: brand, theme, access, and a full-screen menu on a phone. */
export function StageNav({ homeHref, labels }: { homeHref: string; labels: StageNavLabels }) {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const closeMenu = () => setOpen(false);

  // Read from the scroll position rather than from a sentinel: the dot rail
  // jumps between stages, and an anchor jump never fires an intersection
  // change on the way past the one being watched.
  useEffect(() => {
    const onScroll = () => {
      setLifted(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEscapeKey(closeMenu, open);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const wide = window.matchMedia('(min-width: 900px)');
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, [open]);

  const links = [
    { key: 'how', href: '#mechanism', label: labels.how, external: false },
    { key: 'faq', href: '#faq', label: labels.faq, external: false },
    { key: 'docs', href: AppConfig.docsUrl, label: labels.docs, external: true },
  ];

  return (
    <>
      <header {...stylex.props(styles.bar, lifted && styles.barLifted)}>
        <a href={homeHref} {...stylex.props(styles.brand)} aria-label="solsmarket">
          <BrandMark size={20} />
          <BrandWordmark />
        </a>
        <div {...stylex.props(styles.right)}>
          {links.slice(0, 2).map((link) => (
            <a key={link.key} {...stylex.props(styles.link)} href={link.href}>
              {link.label}
            </a>
          ))}
          <AccessDialog labels={labels.access} />
          <button
            type="button"
            {...stylex.props(styles.burger)}
            onClick={() => setOpen(true)}
            aria-label={labels.menu}
            aria-expanded={open}
            data-testid="v1-menu"
          >
            <HugeiconsIcon icon={MenuIcon} size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {open ? (
        <>
          <div {...stylex.props(styles.scrim)} onClick={closeMenu} />
          <div
            {...stylex.props(styles.sheet)}
            role="dialog"
            aria-modal="true"
            aria-label={labels.navLabel}
            data-testid="v1-drawer"
          >
            <div {...stylex.props(styles.sheetHead)}>
              <span {...stylex.props(styles.sheetBrand)}>
                <BrandMark size={20} />
                <BrandWordmark />
              </span>
              <button
                type="button"
                {...stylex.props(styles.burger)}
                onClick={closeMenu}
                aria-label={labels.close}
              >
                <HugeiconsIcon icon={XIcon} size={18} strokeWidth={2} />
              </button>
            </div>
            <nav {...stylex.props(styles.sheetNav)} aria-label={labels.navLabel}>
              {links.map((link, index) => (
                <a
                  key={link.key}
                  {...stylex.props(styles.sheetLink)}
                  href={link.href}
                  onClick={closeMenu}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {link.label}
                  <span {...stylex.props(styles.mark)} aria-hidden>
                    {link.external ? '↗' : String(index + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
