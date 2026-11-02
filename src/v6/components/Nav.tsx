'use client';

import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { font } from '../../styles/tokens.stylex';
import { bp, C } from '../styles/candy.stylex';
import { Mark, Wordmark } from './Brand';
import { Btn, SquareBtn } from './Buttons';
import { lenis } from './Smooth';

const styles = stylex.create({
  bar: {
    position: 'fixed',
    top: 14,
    left: 14,
    right: 14,
    zIndex: 70,
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    height: 66,
    paddingInline: 10,
    borderRadius: 14,
    backgroundColor: C.plate,
    boxShadow: '0 12px 30px -14px rgba(28, 24, 48, 0.35)',
    transitionProperty: 'box-shadow',
    transitionDuration: '0.3s',
  },
  /* Over a coloured panel the plate alone can melt into the page: a ring and
     a drop lift it off once anything is scrolled under it. */
  scrolled: { boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 14px 34px -6px rgba(0, 0, 0, 0.72), 0 4px 10px rgba(0, 0, 0, 0.35)' },
  links: {
    display: { default: 'flex', [bp.max1199]: 'none' },
    alignItems: 'center',
    gap: 2,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  link: {
    whiteSpace: 'nowrap',
    display: 'block',
    paddingBlock: 8,
    paddingInline: 12,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: C.type,
    textDecorationLine: 'none',
    borderRadius: 8,
    backgroundColor: { default: 'transparent', ':hover': { default: null, [bp.hover]: C.plateDeep } },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 3,
    outlineColor: C.blue,
    outlineOffset: -3,
  },
  sep: { width: 1, height: 18, backgroundColor: 'rgba(28, 24, 48, 0.25)', marginInline: 6 },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: C.type,
    textDecorationLine: 'none',
    fontSize: 22,
    paddingInline: 8,
  },
  right: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  join: { display: { default: 'inline-flex', [bp.max991]: 'none' } },
  burger: {
    display: { default: 'none', [bp.max1199]: 'inline-grid' },
    placeItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: C.plateDeep,
    color: C.type,
    cursor: 'pointer',
  },
  sheet: {
    position: 'fixed',
    inset: 0,
    zIndex: 80,
    backgroundColor: C.base,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    paddingTop: 110,
    transitionProperty: 'opacity, visibility',
    transitionDuration: '0.3s',
  },
  hidden: { opacity: 0, visibility: 'hidden' },
  sheetList: { margin: 0, padding: 0, listStyleType: 'none', display: 'grid', gap: 6 },
  sheetLink: {
    display: 'block',
    fontFamily: font.display,
    fontSize: 'clamp(40px, 11vw, 64px)',
    lineHeight: 1,
    textTransform: 'uppercase',
    color: C.type,
    textDecorationLine: 'none',
    paddingBlock: 6,
  },
  sheetFoot: { marginTop: 'auto', display: 'grid', gap: 10 },
  close: {
    position: 'fixed',
    top: 23,
    left: 24,
    zIndex: 81,
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 0,
    backgroundColor: C.type,
    color: C.plate,
    display: 'inline-grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
});

export type NavLabels = { primary: string; menu: string; close: string; join: string; app: string; items: { href: string; label: string }[] };

function Lines() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h16M3 11h16M3 16h16" />
    </svg>
  );
}
function Cross() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l12 12M17 5L5 17" />
    </svg>
  );
}
export function ArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 15L15 5M7 5h8v8" />
    </svg>
  );
}

/**
 * The bar: a cream pill floating over the page, links to the left, the brand
 * in the middle, the waitlist and the app to the right. On phones the links
 * fold into a full-screen sheet.
 */
export function Nav({ homeHref, labels }: { homeHref: string; labels: NavLabels }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A dead band, so the shadow does not flicker where a wheel notch lands.
  useEffect(() => {
    const onScroll = () => setScrolled((prev) => window.scrollY > (prev ? 8 : 24));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    document.documentElement.classList.add('lenis-stopped');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('lenis-stopped');
      lenis()?.start();
    };
  }, [open]);

  return (
    <>
      <header {...stylex.props(styles.bar, scrolled && styles.scrolled)}>
        <nav aria-label={labels.primary}>
          <ul {...stylex.props(styles.links)}>
            {labels.items.map((item, i) => (
              <li key={item.href} style={{ display: 'contents' }}>
                {i > 0 ? <span {...stylex.props(styles.sep)} aria-hidden="true" /> : null}
                <a href={item.href} {...stylex.props(styles.link)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" {...stylex.props(styles.burger)} aria-label={labels.menu} aria-expanded={open} onClick={() => setOpen(true)}>
            <Lines />
          </button>
        </nav>
        <a href={homeHref} {...stylex.props(styles.brand)}>
          <Mark size={30} />
          <Wordmark />
        </a>
        <div {...stylex.props(styles.right)}>
          <Btn href="#join" size="sm" style={styles.join}>
            {labels.join}
          </Btn>
          <SquareBtn href={AppConfig.appUrl} label={labels.app} tone="plate">
            <ArrowUpRight />
          </SquareBtn>
        </div>
      </header>

      <div {...stylex.props(styles.sheet, !open && styles.hidden)} aria-hidden={!open}>
        <button type="button" {...stylex.props(styles.close, !open && styles.hidden)} aria-label={labels.close} onClick={() => setOpen(false)}>
          <Cross />
        </button>
        <ul {...stylex.props(styles.sheetList)}>
          {labels.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} {...stylex.props(styles.sheetLink)} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div {...stylex.props(styles.sheetFoot)}>
          <Btn href="#join" size="lg" onClick={() => setOpen(false)}>
            {labels.join}
          </Btn>
          <Btn href={AppConfig.appUrl} tone="plate" size="lg" icon={<ArrowUpRight />}>
            {labels.app}
          </Btn>
        </div>
      </div>
    </>
  );
}
