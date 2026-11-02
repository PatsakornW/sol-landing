import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { REVISIONS, type RevisionKey } from '@/lib/revisions';
import { brand } from '../../styles/brand.stylex';
import { media } from '../../styles/breakpoints.stylex';
import { font } from '../../styles/tokens.stylex';

/** The popover's id; there is one switch per page. */
const MENU_ID = 'version-switch-menu';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px) scale(0.98)' },
  to: { opacity: 1, transform: 'none' },
});

const styles = stylex.create({
  /* Pinned to the corner of every page. It takes each page's own sans through
     the font token, so it never brings a face of its own. */
  group: {
    position: 'fixed',
    right: 16,
    bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
    zIndex: 60,
    fontFamily: font.sans,
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingInline: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'rgba(255, 255, 255, 0.1)', ':hover': { default: null, [media.hover]: 'rgba(255, 255, 255, 0.22)' } },
    borderRadius: 999,
    backgroundColor: 'rgba(14, 15, 24, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    color: brand.frost,
    fontFamily: 'inherit',
    fontSize: 13.5,
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transitionProperty: 'border-color',
    transitionDuration: '200ms',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    outlineColor: brand.blue,
    outlineOffset: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: brand.blue,
  },
  chevron: {
    width: 14,
    height: 14,
    opacity: 0.7,
  },
  /* The list, opened above the trigger. A popover sits in the top layer, so
     it is placed against the viewport, just over the trigger's corner. */
  menu: {
    position: 'fixed',
    inset: 'auto',
    right: 16,
    bottom: 'calc(16px + 44px + 8px + env(safe-area-inset-bottom, 0px))',
    margin: 0,
    minWidth: 132,
    padding: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    backgroundColor: 'rgba(14, 15, 24, 0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6)',
    color: brand.frost,
    fontFamily: font.sans,
    animationName: rise,
    animationDuration: '180ms',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  list: {
    display: 'grid',
    gap: 2,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBlock: 8,
    paddingInline: 12,
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0.02em',
    color: {
      default: 'rgba(242, 244, 248, 0.7)',
      ':hover': { default: null, [media.hover]: brand.frost },
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: 'rgba(255, 255, 255, 0.08)' },
    },
    textDecorationLine: 'none',
    transitionProperty: 'background-color, color',
    transitionDuration: '200ms',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    outlineColor: brand.blue,
    outlineOffset: -2,
  },
  current: {
    backgroundColor: { default: brand.blue, ':hover': brand.blue },
    color: { default: '#FFFFFF', ':hover': '#FFFFFF' },
  },
});

/**
 * The corner switch between every design, as a dropdown that opens upward.
 *
 * The trigger shows the design that is open; the list above it holds them
 * all. It is the browser's own popover — opened by the button, closed by a
 * click outside or Escape — so it needs no script and stays a server
 * component on every page. Each design is its own document, so a step across
 * is a link, and the one already open is marked as the current page. The list
 * is `REVISIONS`, so a design added there appears here on every page.
 */
export function VersionSwitch({ current, label }: { current: RevisionKey; label: string }) {
  const open = REVISIONS.find((revision) => revision.key === current);
  return (
    <nav aria-label={label} {...stylex.props(styles.group)} data-testid="landing-version-switch">
      <button type="button" popoverTarget={MENU_ID} aria-label={`${label}: ${open?.label ?? ''}`} {...stylex.props(styles.trigger)}>
        <span aria-hidden="true" {...stylex.props(styles.dot)} />
        {open?.label}
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...stylex.props(styles.chevron)}>
          <path d="M4.5 9.5 8 6l3.5 3.5" />
        </svg>
      </button>
      <div id={MENU_ID} popover="auto" {...stylex.props(styles.menu)}>
        <ul {...stylex.props(styles.list)}>
          {REVISIONS.map((revision) => {
            const on = revision.key === current;
            return (
              <li key={revision.key}>
                <Link href={revision.path} aria-current={on ? 'page' : undefined} {...stylex.props(styles.item, on && styles.current)}>
                  {revision.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
