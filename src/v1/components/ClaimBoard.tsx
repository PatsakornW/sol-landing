import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { color, font } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

/**
 * The split the example is drawn at.
 *
 * Fixed and stated as illustrative wherever it appears — the stage is
 * explaining what a price *means*, not quoting one, and a figure that moved
 * would read as a live market on a page that has none.
 */
const YES = 63;

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [media.md]: 'minmax(0, 7fr) minmax(0, 5fr)' },
    columnGap: 'clamp(24px, 5vw, 72px)',
    rowGap: { default: 28, [media.sm]: 36 },
    alignItems: 'start',
    width: '100%',
  },
  /* The worked example: a question, the split it trades at, and what that
     number is actually saying. It is the one place on the revision where the
     product's own shape appears at reading size. */
  example: {
    minWidth: 0,
  },
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 0,
    marginBottom: 12,
    paddingBlock: 4,
    paddingInline: 10,
    borderRadius: STAGE.pill,
    backgroundColor: color.accentFill,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: color.landingPrimary,
  },
  question: {
    margin: 0,
    maxWidth: '26ch',
    fontSize: { default: 19, [media.sm]: 23 },
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    color: color.fg,
  },
  questionOn: {
    color: '#f5f7fb',
  },
  figures: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    margin: 0,
    marginTop: 20,
  },
  side: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  sideLabel: {
    fontFamily: font.mono,
    fontSize: 11.5,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: color.mutedFg,
  },
  value: {
    fontSize: { default: 30, [media.sm]: 38 },
    fontWeight: 600,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  yes: {
    color: color.landingPrimary,
  },
  no: {
    color: color.mutedFg,
  },
  /* The bar itself: one track, filled to the YES side. The NO side is the
     ground, because the two are the same hundred. */
  track: {
    display: 'flex',
    width: '100%',
    height: 12,
    marginTop: 12,
    borderRadius: STAGE.pill,
    backgroundColor: color.muted,
    overflow: 'hidden',
  },
  trackOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  fill: {
    height: '100%',
    backgroundColor: color.landingPrimary,
  },
  reading: {
    margin: 0,
    marginTop: 16,
    maxWidth: '54ch',
    fontSize: { default: 15, [media.sm]: 16.5 },
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  readingOn: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  note: {
    margin: 0,
    marginTop: 12,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: '0.04em',
    lineHeight: 1.6,
    color: color.mutedFg,
  },

  /* Three lines on why a price beats an opinion, held by one hairline each. */
  points: {
    display: 'grid',
    gap: 0,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    minWidth: 0,
  },
  point: {
    paddingBlock: { default: 14, [media.sm]: 16 },
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: color.border,
  },
  pointOn: {
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  term: {
    margin: 0,
    fontSize: { default: 15.5, [media.sm]: 16.5 },
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
    color: color.fg,
  },
  termOn: {
    color: '#f5f7fb',
  },
  desc: {
    margin: 0,
    marginTop: 6,
    maxWidth: '42ch',
    fontSize: 14,
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  descOn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export type ClaimPoint = { key: string; term: string; desc: string };

export type ClaimLabels = {
  label: string;
  question: string;
  yes: string;
  no: string;
  reading: string;
  note: string;
};

/** The claim, shown rather than asserted: one example priced by a market. */
export function ClaimBoard({
  labels,
  points,
  invert = false,
}: {
  labels: ClaimLabels;
  points: readonly ClaimPoint[];
  invert?: boolean;
}) {
  return (
    <div {...stylex.props(styles.grid)}>
      <div {...stylex.props(styles.example)}>
        <p {...stylex.props(styles.label)}>{labels.label}</p>
        <p {...stylex.props(styles.question, invert && styles.questionOn)}>{labels.question}</p>

        <p {...stylex.props(styles.figures)}>
          <span {...stylex.props(styles.side)}>
            <span {...stylex.props(styles.sideLabel, styles.yes)}>{labels.yes}</span>
            <span {...stylex.props(styles.value, styles.yes)}>{YES}%</span>
          </span>
          <span {...stylex.props(styles.side)}>
            <span {...stylex.props(styles.value, styles.no)}>{100 - YES}%</span>
            <span {...stylex.props(styles.sideLabel, styles.no)}>{labels.no}</span>
          </span>
        </p>
        <span {...stylex.props(styles.track, invert && styles.trackOn)} aria-hidden>
          <span {...stylex.props(styles.fill)} style={{ width: `${YES}%` }} />
        </span>

        <p {...stylex.props(styles.reading, invert && styles.readingOn)}>{labels.reading}</p>
        <p {...stylex.props(styles.note)}>{labels.note}</p>
      </div>

      <ul {...stylex.props(styles.points)}>
        {points.map((point) => (
          <li key={point.key} {...stylex.props(styles.point, invert && styles.pointOn)}>
            <h3 {...stylex.props(styles.term, invert && styles.termOn)}>{point.term}</h3>
            <p {...stylex.props(styles.desc, invert && styles.descOn)}>{point.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
