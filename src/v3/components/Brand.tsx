import * as stylex from '@stylexjs/stylex';
import { V3 } from '../styles/eclipse.stylex';
import { Orbs } from './Orbs';

const styles = stylex.create({
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    textDecorationLine: 'none',
    fontSize: 18,
    letterSpacing: '-0.015em',
    color: V3.dust,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
    borderRadius: 6,
  },
  mark: {
    width: 24,
    height: 24,
    flexShrink: 0,
  },
  sols: {
    fontWeight: 700,
    color: V3.star,
  },
  market: {
    fontWeight: 400,
  },
});

/** The mark and the wordmark, as a link home. */
export function Brand({ href }: { href: string }) {
  return (
    <a href={href} {...stylex.props(styles.brand)} aria-label="solsmarket home">
      <Orbs style={styles.mark} />
      <span>
        <b {...stylex.props(styles.sols)}>sols</b>
        <span {...stylex.props(styles.market)}>market</span>
      </span>
    </a>
  );
}
