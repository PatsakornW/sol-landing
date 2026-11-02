'use client';

import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { V3 } from '../styles/eclipse.stylex';

const styles = stylex.create({
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingBlock: 0,
    paddingInline: 26,
    borderWidth: 0,
    borderRadius: V3.pill,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1,
    letterSpacing: '-0.005em',
    textDecorationLine: 'none',
    cursor: 'pointer',
    transitionProperty: 'transform, box-shadow, background-color',
    transitionDuration: '0.5s, 0.5s, 0.3s',
    transitionTimingFunction: `${V3.ease}, ${V3.ease}, ease`,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
  /* Lit from the corona: a warm white face with a glow that widens on hover. */
  sun: {
    backgroundColor: V3.sun,
    color: V3.ink,
    boxShadow: {
      default: '0 0 0 1px rgba(255, 227, 179, 0.4), 0 14px 50px -12px rgba(255, 214, 160, 0.65)',
      ':hover':
        '0 0 0 1px rgba(255, 227, 179, 0.6), 0 20px 70px -10px rgba(255, 214, 160, 0.9), 0 0 120px -20px rgba(220, 116, 236, 0.6)',
    },
    transform: { default: null, ':hover': 'translateY(-2px)' },
  },
  ghost: {
    backgroundColor: {
      default: 'rgba(239, 237, 250, 0.06)',
      ':hover': 'rgba(239, 237, 250, 0.12)',
    },
    color: V3.star,
    boxShadow: `inset 0 0 0 1px ${V3.line2}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  arrow: {
    width: 15,
    height: 15,
    flexShrink: 0,
  },
});

/** The arrow glyph the buttons end in. */
export function ArrowGlyph({ style }: { style?: StyleXStyles }) {
  return (
    <svg viewBox="0 0 24 24" {...stylex.props(styles.arrow, style)} aria-hidden="true">
      <path
        d="M9 6.65s6.94-.54 7.92.43c.97.98.43 7.92.43 7.92M16.5 7.5l-10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Common = {
  tone: 'sun' | 'ghost';
  arrow?: boolean;
  style?: StyleXStyles;
  children: ReactNode;
};

type LinkProps = Common & { href: string; onClick?: () => void };
type ButtonProps = Common & {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: () => void;
  'aria-haspopup'?: 'dialog';
  'aria-expanded'?: boolean;
  'aria-disabled'?: boolean;
};

/**
 * The page's pill button, as a link when it goes somewhere and a button when
 * it does something.
 */
export function Btn(props: LinkProps | ButtonProps) {
  const { tone, arrow = false, style, children } = props;
  const classes = stylex.props(styles.btn, tone === 'sun' ? styles.sun : styles.ghost, style);

  if (props.href !== undefined) {
    return (
      <a {...classes} href={props.href} onClick={props.onClick}>
        {children}
        {arrow ? <ArrowGlyph /> : null}
      </a>
    );
  }

  return (
    <button
      {...classes}
      type={props.type ?? 'button'}
      onClick={props.onClick}
      aria-haspopup={props['aria-haspopup']}
      aria-expanded={props['aria-expanded']}
      aria-disabled={props['aria-disabled']}
    >
      {children}
      {arrow ? <ArrowGlyph /> : null}
    </button>
  );
}
