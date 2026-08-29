'use client';

import * as stylex from '@stylexjs/stylex';
import { translatorFor } from '@/v3/i18n/messages';
import { useRouter } from 'next/navigation';
import { nextRevisionPath } from '@/lib/revisions';
import { media } from '../../styles/breakpoints.stylex';
import { color, font } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

const styles = stylex.create({
  button: {
    position: 'fixed',
    right: 16,
    bottom: 16,
    zIndex: 60,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 32,
    paddingBlock: 0,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    borderRadius: GLASS.pill,
    backgroundColor: {
      default: color.card,
      ':hover': { default: null, [media.hover]: color.hover },
      ':active': color.active,
    },
    color: color.fg,
    fontFamily: font.sans,
    fontSize: 11.5,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': color.ring },
    outlineOffset: { default: null, ':focus-visible': 2 },
  },
});

/** The corner revision switch, as a floating pill. */
export function VersionToggle() {
  const t = translatorFor();
  const router = useRouter();
  const label = t('v3.toggle');

  return (
    <button
      type="button"
      {...stylex.props(styles.button)}
      onClick={() => router.push(nextRevisionPath('parallax'))}
      aria-label={label}
      title={label}
      data-testid="landing-version-toggle"
    >
      V3
    </button>
  );
}
