import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { V3 } from './eclipse.stylex';

/** The measures every section of the page shares. */
export const shared = stylex.create({
  wrap: {
    width: `min(100% - 2 * ${V3.gutter}, ${V3.max})`,
    marginInline: 'auto',
  },
  /** A section head, in the serif. */
  h2: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(42px, 6vw, 96px)',
    lineHeight: 0.98,
    letterSpacing: '-0.035em',
    textWrap: 'balance',
  },
  /** The line under a head. */
  sub: {
    margin: 0,
    marginTop: 20,
    maxWidth: '44ch',
    color: V3.dust,
    fontSize: 'clamp(17px, 1.45vw, 21px)',
    lineHeight: 1.5,
    textWrap: 'pretty',
  },
  /** Small print. */
  fine: {
    margin: 0,
    marginTop: 14,
    fontSize: 13.5,
    color: V3.faint,
  },
  /** Anchor targets stop short of the fixed bar. */
  section: {
    scrollMarginTop: 80,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});
