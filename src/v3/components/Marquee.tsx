import { Fragment } from 'react';
import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { font } from '../../styles/tokens.stylex';
import { V3 } from '../styles/eclipse.stylex';
import { Orbs } from './Orbs';

const slide = stylex.keyframes({
  to: { transform: 'translateX(-50%)' },
});

const styles = stylex.create({
  marquee: {
    position: 'relative',
    overflow: 'hidden',
    paddingBlock: 'clamp(22px, 3.4vw, 40px)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopColor: V3.line,
    borderBottomColor: V3.line,
  },
  /* Two copies of the row, and the track slides exactly one copy's width, so
     the loop never shows its seam. */
  track: {
    display: 'flex',
    width: 'max-content',
    animationName: { default: slide, [media.reduce]: 'none' },
    animationDuration: '60s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(30px, 4.4vw, 70px)',
    paddingRight: 'clamp(30px, 4.4vw, 70px)',
  },
  word: {
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(46px, 8.4vw, 140px)',
    lineHeight: 1,
    letterSpacing: '-0.03em',
    color: 'transparent',
    WebkitTextStroke: '1px rgba(239, 237, 250, 0.34)',
  },
  wordFilled: {
    color: V3.star,
    WebkitTextStroke: '0',
  },
  orb: {
    width: 'clamp(30px, 3.6vw, 58px)',
    height: 'auto',
    flexShrink: 0,
  },
});

/** The six desks, as a ribbon of type. Decorative: the desks section names them. */
export function Marquee({ words }: { words: readonly string[] }) {
  const group = (
    <div {...stylex.props(styles.group)}>
      {words.map((word, index) => (
        <Fragment key={word}>
          <span {...stylex.props(styles.word, index % 2 === 0 && styles.wordFilled)}>{word}</span>
          <Orbs style={styles.orb} />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div {...stylex.props(styles.marquee)} aria-hidden="true">
      <div {...stylex.props(styles.track)}>
        {group}
        {group}
      </div>
    </div>
  );
}
