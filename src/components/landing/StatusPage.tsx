'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { PressButton } from '@/components/landing/PressButton';
import { media } from '../../styles/breakpoints.stylex';
import { color, font, shadow } from '../../styles/tokens.stylex';

const styles = stylex.create({
  section: {
    width: '100%',
    minHeight: '60vh',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    paddingBlock: 48,
    paddingInline: 24,
    backgroundColor: color.surface2,
    boxShadow: shadow.surface2,
  },
  eyebrow: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 1,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: color.landingPrimary,
  },
  title: {
    margin: 0,
    maxWidth: '14ch',
    marginInline: 'auto',
    paddingBottom: '0.18em',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(34px, 4.6vw, 58px)',
    lineHeight: 0.9,
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    color: color.fg,
  },
  titleFollow: {
    marginTop: 12,
  },
  lead: {
    marginTop: 16,
    marginInline: 'auto',
    marginBottom: 28,
    maxWidth: '40ch',
    fontSize: 15,
    lineHeight: 1.65,
    color: color.mutedFg,
  },
  home: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingInline: 18,
    borderRadius: 3,
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1.2,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#fff',
    backgroundColor: {
      default: color.pressFace,
      ':hover': { default: null, [media.hover]: color.pressFaceHover },
      ':active': color.pressFaceActive,
    },
    boxShadow: {
      default: `0 5px 0 0 ${color.pressDepth}`,
      ':active': `0 0 0 0 ${color.pressDepth}`,
    },
    transform: { default: null, ':active': 'translateY(5px)' },
    fontFamily: font.mono,
  },
});

export function StatusPage({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  action: ReactNode;
}) {
  const followTitle = Boolean(eyebrow);
  return (
    <section {...stylex.props(styles.section)}>
      <div>
        {followTitle ? <p {...stylex.props(styles.eyebrow)}>{eyebrow}</p> : null}
        <h1 {...stylex.props(styles.title, followTitle && styles.titleFollow)}>{title}</h1>
        <p {...stylex.props(styles.lead)}>{body}</p>
        {action}
      </div>
    </section>
  );
}

export function StatusRetry({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <PressButton type="button" variant="primary" onClick={onClick}>
      {children}
    </PressButton>
  );
}

export function StatusHome({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} {...stylex.props(styles.home)}>
      {children}
    </Link>
  );
}
