import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { C } from '../styles/candy.stylex';

const styles = stylex.create({
  tag: {
    display: 'inline-block',
    paddingBlock: 8,
    paddingInline: 16,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 'clamp(15px, 1.3vw, 20px)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
    color: C.plate,
    backgroundColor: C.type,
    boxShadow: '0 10px 24px -10px rgba(28, 24, 48, 0.5)',
    transform: 'rotate(-4deg)',
    transformOrigin: 'left center',
  },
  big: { paddingBlock: 12, paddingInline: 22, fontSize: 'clamp(18px, 2vw, 30px)' },
  bg: (c: string) => ({ backgroundColor: c }),
  fg: (c: string) => ({ color: c }),
});

/** A tilted label, like a sticker slapped on the shelf. */
export function Sticker({ children, bg, fg, big, style }: { children: ReactNode; bg?: string; fg?: string; big?: boolean; style?: stylex.StyleXStyles }) {
  return <span {...stylex.props(styles.tag, big && styles.big, bg ? styles.bg(bg) : null, fg ? styles.fg(fg) : null, style)}>{children}</span>;
}
