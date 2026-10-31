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
import { GLASS } from '../styles/glass.stylex';

const styles = stylex.create({
  /* Nothing but the controls floats over the shot: no bar, no rule, no ground
     of its own. The strip ignores the pointer and each control takes it back. */
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) auto',
      [media.md]: 'minmax(0, 1fr) auto minmax(0, 1fr)',
    },
    alignItems: 'center',
    columnGap: 12,
    paddingInline: space.pageInline,
    paddingBlock: { default: 12, [media.sm]: 16 },
    pointerEvents: 'none',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    justifySelf: 'start',
    paddingBlock: 7,
    paddingInline: 12,
    borderRadius: GLASS.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 62%, transparent)`,
    backdropFilter: GLASS.blurChrome,
    WebkitBackdropFilter: GLASS.blurChrome,
    color: color.fg,
    textDecorationLine: 'none',
    pointerEvents: 'auto',
  },
  /* The capsule: the reference's centred pill of links, in one pane of glass
     with the active item filled. */
  capsule: {
    display: { default: 'none', [media.md]: 'inline-flex' },
    alignItems: 'center',
    gap: 2,
    justifySelf: 'center',
    padding: 4,
    borderRadius: GLASS.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 55%, transparent)`,
    backdropFilter: GLASS.blurChrome,
    WebkitBackdropFilter: GLASS.blurChrome,
    pointerEvents: 'auto',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 34,
    paddingInline: 16,
    borderRadius: GLASS.pill,
    fontSize: 13.5,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    color: { default: color.mutedFg, ':hover': { default: null, [media.hover]: color.fg } },
    backgroundColor: { default: null, ':hover': { default: null, [media.hover]: color.hover } },
    textDecorationLine: 'none',
    whiteSpace: 'nowrap',
    transitionProperty: 'color, background-color',
    transitionDuration: '200ms',
    transitionTimingFunction: motion.ease,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': color.ring },
    outlineOffset: { default: null, ':focus-visible': 2 },
  },
  /* The first entry is the page you are on, filled the way the reference fills
     its current tab — against the page's ink rather than a surface token, so it
     inverts correctly in both palettes. */
  linkOn: {
    backgroundColor: color.fg,
    color: color.background,
  },
  right: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    justifySelf: 'end',
    pointerEvents: 'auto',
  },
  burger: {
    display: { default: 'inline-flex', [media.md]: 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    padding: 0,
    borderRadius: GLASS.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: {
      default: `color-mix(in srgb, ${color.card} 62%, transparent)`,
      ':active': color.active,
    },
    backdropFilter: GLASS.blurChrome,
    WebkitBackdropFilter: GLASS.blurChrome,
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
    backgroundColor: 'rgba(7, 9, 13, 0.4)',
  },
  /* The reference drops its phone menu straight down from under the bar as one
     frosted sheet; this is that, cut to the page's corner scale. */
  sheet: {
    position: 'fixed',
    top: 8,
    left: 8,
    right: 8,
    zIndex: 55,
    padding: 10,
    borderRadius: GLASS.panel,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 82%, transparent)`,
    backdropFilter: GLASS.blurChrome,
    WebkitBackdropFilter: GLASS.blurChrome,
    animationName: {
      default: stylex.keyframes({
        from: { opacity: 0, translate: '0 -10px' },
        to: { opacity: 1, translate: '0 0' },
      }),
      [media.reduce]: 'none',
    },
    animationDuration: '220ms',
    animationTimingFunction: motion.ease,
  },
  sheetHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 6,
    paddingBottom: 10,
  },
  sheetLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 52,
    paddingInline: 14,
    borderRadius: GLASS.inner,
    fontSize: 16,
    fontWeight: 500,
    color: color.fg,
    textDecorationLine: 'none',
    backgroundColor: { default: null, ':active': color.active },
  },
  mark: {
    fontFamily: font.mono,
    fontSize: 12,
    color: color.landingPrimary,
  },
});

export type PillNavLabels = {
  navLabel: string;
  home: string;
  how: string;
  faq: string;
  docs: string;
  menu: string;
  close: string;
  access: AccessLabels;
};

/**
 * The floating chrome: brand pane, link capsule, controls.
 *
 * The reference ends its bar with a "Reserve Yours" pill; here the access
 * dialog already is that button, so there is not a second one beside it saying
 * the same thing.
 */
export function PillNav({ homeHref, labels }: { homeHref: string; labels: PillNavLabels }) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

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
    { key: 'home', href: '#overview', label: labels.home, external: false },
    { key: 'how', href: '#mechanism', label: labels.how, external: false },
    { key: 'faq', href: '#faq', label: labels.faq, external: false },
    { key: 'docs', href: AppConfig.docsUrl, label: labels.docs, external: true },
  ];

  return (
    <>
      <header {...stylex.props(styles.bar)}>
        <a href={homeHref} {...stylex.props(styles.brand)} aria-label="solsmarket">
          <BrandMark size={18} />
          <BrandWordmark />
        </a>

        <nav {...stylex.props(styles.capsule)} aria-label={labels.navLabel}>
          {links.map((link, index) => (
            <a
              key={link.key}
              {...stylex.props(styles.link, index === 0 && styles.linkOn)}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div {...stylex.props(styles.right)}>
          <AccessDialog labels={labels.access} />
          <button
            type="button"
            {...stylex.props(styles.burger)}
            onClick={() => setOpen(true)}
            aria-label={labels.menu}
            aria-expanded={open}
            data-testid="v2-menu"
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
            data-testid="v2-drawer"
          >
            <div {...stylex.props(styles.sheetHead)}>
              <span {...stylex.props(styles.brand)}>
                <BrandMark size={18} />
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
            <nav aria-label={labels.navLabel}>
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
