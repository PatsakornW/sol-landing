import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { shape } from '../../styles/shape.stylex';
import { color, font } from '../../styles/tokens.stylex';

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: shape.bgRadius,
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1.2,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontFamily: font.mono,
    userSelect: 'none',
    transitionProperty: 'background-color, color, transform, box-shadow',
    transitionDuration: '0.12s, 0.12s, 0.1s, 0.1s',
    transitionTimingFunction: 'ease',
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: color.ring,
      outlineOffset: 2,
    },
  },
  primary: {
    gap: 8,
    height: 44,
    paddingInline: 18,
    paddingBlock: 0,
    // Same register as the section headings above it. Anton ships one weight,
    // so `base`'s 600 has to come back down to 400 or the browser synthesises a
    // fake bold.
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 16,
    // Positive, unlike the headings' -0.01em: Anton's tight sidebearings can
    // take negative tracking at 34-52px, but at 16px the same value closes the
    // counters up. Matches the `access` variant below.
    letterSpacing: '0.02em',
    color: '#fff',
    /* The key's face, its hover tint and its pressed tint are one property with
       three conditions — the hover one gated to a device that can hover, so a
       tap does not leave the key lit. */
    backgroundColor: {
      default: color.pressFace,
      ':hover': { default: null, [media.hover]: color.pressFaceHover },
      ':active': color.pressFaceActive,
    },
    /* Pressing collapses the depth slab and drops the face onto it. */
    boxShadow: {
      default: `0 5px 0 0 ${color.pressDepth}`,
      ':active': `0 0 0 0 ${color.pressDepth}`,
    },
    transform: { default: null, ':active': 'translateY(5px)' },
  },
  primaryAccent: {
    gap: 8,
    height: 44,
    paddingInline: 18,
    paddingBlock: 0,
    color: color.accentOrangeInk,
    backgroundColor: {
      default: color.accentOrange,
      ':hover': { default: null, [media.hover]: color.accentOrangeHover },
      ':active': color.accentOrangeActive,
    },
    boxShadow: {
      default: `0 5px 0 0 ${color.accentOrangeDepth}`,
      ':active': `0 0 0 0 ${color.accentOrangeDepth}`,
    },
    transform: { default: null, ':active': 'translateY(5px)' },
  },
  access: {
    gap: 8,
    minHeight: { default: 48, [media.maxSm]: 44 },
    paddingInline: { default: 16, [media.maxSm]: 14 },
    paddingBlock: 0,
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: { default: 16, [media.maxSm]: 15 },
    letterSpacing: '0.02em',
    color: '#1656cc',
    backgroundColor: {
      default: color.pressAccessFace,
      ':hover': { default: null, [media.hover]: color.pressAccessFaceHover },
      ':active': color.pressAccessFaceActive,
    },
    boxShadow: {
      default: `0 5px 0 0 ${color.pressAccessDepth}`,
      ':active': `0 0 0 0 ${color.pressAccessDepth}`,
    },
    transform: { default: null, ':active': 'translateY(5px)' },
  },
  accessAccent: {
    gap: 8,
    minHeight: { default: 48, [media.maxSm]: 44 },
    paddingInline: { default: 16, [media.maxSm]: 14 },
    paddingBlock: 0,
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: { default: 16, [media.maxSm]: 15 },
    letterSpacing: '0.02em',
    color: color.accentOrangeInk,
    backgroundColor: {
      default: color.accentOrange,
      ':hover': { default: null, [media.hover]: color.accentOrangeHover },
      ':active': color.accentOrangeActive,
    },
    boxShadow: {
      default: `0 5px 0 0 ${color.accentOrangeDepth}`,
      ':active': `0 0 0 0 ${color.accentOrangeDepth}`,
    },
    transform: { default: null, ':active': 'translateY(5px)' },
  },
  block: {
    width: '100%',
  },
  blockNarrow: {
    width: { default: null, [media.maxSm]: '100%' },
  },
});

type PressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'access';
  tone?: 'brand' | 'accent';
  block?: boolean;
  blockNarrow?: boolean;
};

export const PressButton = forwardRef<HTMLButtonElement, PressButtonProps>(function PressButton(
  { children, variant = 'primary', tone = 'brand', block = false, blockNarrow = false, ...props },
  ref,
) {
  const face =
    variant === 'access'
      ? tone === 'accent'
        ? styles.accessAccent
        : styles.access
      : tone === 'accent'
        ? styles.primaryAccent
        : styles.primary;

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      {...stylex.props(
        styles.base,
        face,
        /* `blockNarrow` first: it is a phone-only width, and a later style
             replaces the whole property, so `block`'s unconditional 100% has to
             be the one that wins when a caller asks for both. */
        blockNarrow && styles.blockNarrow,
        block && styles.block,
      )}
    >
      {children}
    </button>
  );
});
