import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { bp, C } from '../styles/candy.stylex';

const styles = stylex.create({
  btn: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    paddingInline: 22,
    borderRadius: 12,
    borderWidth: 0,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecorationLine: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 3,
    outlineColor: C.blue,
    outlineOffset: 3,
    transitionProperty: 'transform, background-color',
    transitionDuration: '0.25s',
    transform: { default: null, ':active': 'scale(0.97)' },
  },
  primary: { backgroundColor: C.blue, color: '#FFFFFF' },
  plate: { backgroundColor: C.plateDeep, color: C.type },
  pink: { backgroundColor: C.pink, color: C.base },
  sm: { height: 42, paddingInline: 16, fontSize: 15 },
  lg: { height: 58, paddingInline: 30, fontSize: 19, borderRadius: 16 },
  /* The label is two copies of the same text in a one-line window; on hover
     each letter lifts a line, one after the other. */
  stack: { position: 'relative', display: 'block', height: '1em', lineHeight: 1, overflow: 'hidden' },
  line: { display: 'block', whiteSpace: 'pre' },
  ch: {
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.45s',
    transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    transitionDelay: 'calc(var(--i) * 14ms)',
    /* The lift itself is `[data-stagger]:hover [data-ch]` in v6.css: a parent
       hover is not something a StyleX rule can say. */
  },
  square: {
    width: 48,
    paddingInline: 0,
  },
  round: {
    display: 'inline-grid',
    placeItems: 'center',
    width: 'clamp(96px, 9vw, 132px)',
    height: 'clamp(96px, 9vw, 132px)',
    borderRadius: '50%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'currentColor',
    color: 'inherit',
    fontFamily: font.sans,
    fontWeight: 700,
    fontSize: 'clamp(14px, 1.2vw, 17px)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 1.1,
    textDecorationLine: 'none',
    cursor: 'pointer',
    transform: 'rotate(-8deg)',
    transitionProperty: 'background-color, color',
    transitionDuration: '0.25s',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [bp.hover]: C.type } },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 3,
    outlineColor: C.blue,
    outlineOffset: 4,
  },
  roundInk: { color: { default: 'inherit', ':hover': { default: null, [bp.hover]: C.base } } },
});

export type Tone = 'primary' | 'plate' | 'pink';

function Label({ text }: { text: string }) {
  const chars = Array.from(text);
  const line = (
    <span {...stylex.props(styles.line)} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} {...stylex.props(styles.ch)} data-ch="" style={{ '--i': i } as CSSProperties}>
          {c}
        </span>
      ))}
    </span>
  );
  return (
    <span {...stylex.props(styles.stack)}>
      {line}
      {line}
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text}</span>
    </span>
  );
}

type Common = { tone?: Tone; size?: 'sm' | 'md' | 'lg'; style?: stylex.StyleXStyles; children: string; icon?: ReactNode };

/** A pill with a staggered letter lift on hover. Renders `<a>` with `href`. */
type Anchor = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'style' | 'children'>;
type Button = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'children'>;

export function Btn({ tone = 'primary', size = 'md', style, children, icon, ...rest }: Common & (Anchor | Button)) {
  const props = { ...stylex.props(styles.btn, styles[tone], size === 'sm' && styles.sm, size === 'lg' && styles.lg, style), 'data-stagger': '' };
  const body = (
    <>
      <Label text={children} />
      {icon}
    </>
  );
  if ('href' in rest && rest.href) {
    return (
      <a {...(rest as Anchor)} {...props}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as Button)} {...props}>
      {body}
    </button>
  );
}

/** A square icon pill, for the one button that is only a glyph. */
export function SquareBtn({ tone = 'plate', label, children, style, ...rest }: { tone?: Tone; label: string; children: ReactNode; style?: stylex.StyleXStyles } & Anchor) {
  return (
    <a aria-label={label} title={label} {...rest} {...stylex.props(styles.btn, styles[tone], styles.square, style)}>
      {children}
    </a>
  );
}

/** The round stamp: outlined, tilted, magnetic. */
export function RoundBtn({ href, children, style, ...rest }: { href: string; children: ReactNode; style?: stylex.StyleXStyles } & Anchor) {
  return (
    <span data-magnetic="0.35" data-magnetic-target="a" style={{ display: 'inline-block', padding: 16 }}>
      <a href={href} {...rest} {...stylex.props(styles.round, styles.roundInk, style)}>
        {children}
      </a>
    </span>
  );
}
