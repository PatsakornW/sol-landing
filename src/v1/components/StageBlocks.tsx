import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { WaitlistDarkForm } from '@/components/landing/Waitlist';
import { media } from '../../styles/breakpoints.stylex';
import { color, font } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const styles = stylex.create({
  /* A stage's body is a list, never a grid of cards: at this scale the reader
     is being walked through one point at a time. */
  list: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.md]: 'repeat(2, minmax(0, 1fr))',
    },
    columnGap: 'clamp(24px, 4vw, 64px)',
    rowGap: 0,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    columnGap: 14,
    alignItems: 'baseline',
    paddingBlock: { default: 12, [media.sm]: 14 },
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: color.border,
    minWidth: 0,
  },
  rowOn: {
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  num: {
    fontFamily: font.mono,
    fontSize: 11.5,
    letterSpacing: '0.1em',
    color: color.landingPrimary,
    fontVariantNumeric: 'tabular-nums',
  },
  term: {
    margin: 0,
    fontSize: { default: 17, [media.sm]: 20 },
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    color: color.fg,
  },
  termOn: {
    /* Light in both palettes — see `Stage.invert`. */
    color: '#f5f7fb',
  },
  desc: {
    margin: 0,
    marginTop: 6,
    maxWidth: '52ch',
    fontSize: { default: 14.5, [media.sm]: 15.5 },
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  descOn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  /* The last stage's body: the form where the reader is looking, and the
     colophon pushed to the foot of the screen — a footer floating in the middle
     of a stage is just another paragraph. */
  close: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gap: 24,
    height: '100%',
    minHeight: 0,
  },
  colophon: {
    display: 'grid',
    gap: 12,
    alignSelf: 'end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: color.border,
  },
  colophonOn: {
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: { default: 14, [media.sm]: 22 },
    fontSize: 14,
  },
  link: {
    color: { default: color.mutedFg, ':hover': { default: null, [media.hover]: color.fg } },
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    textUnderlineOffset: 4,
  },
  linkOn: {
    color: {
      default: 'rgba(255, 255, 255, 0.7)',
      ':hover': { default: null, [media.hover]: '#ffffff' },
    },
  },
  legal: {
    margin: 0,
    maxWidth: '64ch',
    fontFamily: font.mono,
    fontSize: 11,
    lineHeight: 1.7,
    color: color.mutedFg,
  },
  legalOn: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  /* The same shape V1 gives its access band: one panel across the full
     measure, the promise on the left and the control on the right, so the
     reader's eye lands on the line and then on the thing that acts on it. A
     card half the column wide reads as the leftover half of a pair. */
  band: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.md]: 'minmax(0, 1fr) auto',
    },
    alignItems: 'center',
    columnGap: 'clamp(24px, 4vw, 64px)',
    rowGap: 20,
    padding: { default: 20, [media.sm]: 'clamp(24px, 3vw, 40px)' },
    borderRadius: STAGE.frame,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: color.card,
  },
  bandCopy: {
    minWidth: 0,
  },
  bandLabel: {
    margin: 0,
    marginBottom: 10,
    fontFamily: font.mono,
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: color.landingPrimary,
  },
  bandBody: {
    margin: 0,
    maxWidth: '46ch',
    fontSize: { default: 15, [media.sm]: 16.5 },
    lineHeight: 1.5,
    letterSpacing: '-0.01em',
    color: color.fg,
    textWrap: 'pretty',
  },
  bandNote: {
    margin: 0,
    marginTop: 10,
    maxWidth: '52ch',
    fontSize: 12.5,
    lineHeight: 1.6,
    color: color.mutedFg,
  },
  /* The form keeps its own width on the right; below `md` it drops under the
     line it belongs to and stretches. */
  bandForm: {
    minWidth: 0,
    justifySelf: { default: 'stretch', [media.md]: 'end' },
  },
});

export type StageRow = { key: string; term: string; desc: string };

/** A stage's numbered list. */
export function StageList({
  rows,
  invert = false,
}: {
  rows: readonly StageRow[];
  invert?: boolean;
}) {
  return (
    <ul {...stylex.props(styles.list)}>
      {rows.map((row, index) => (
        <li key={row.key} {...stylex.props(styles.row, invert && styles.rowOn)}>
          <span {...stylex.props(styles.num)}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 {...stylex.props(styles.term, invert && styles.termOn)}>{row.term}</h3>
            <p {...stylex.props(styles.desc, invert && styles.descOn)}>{row.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export type CloseLabels = {
  kicker: string;
  body: string;
  note: string;
  docs: string;
  app: string;
  contact: string;
  copyright: string;
  disclaimer: string;
};

/** The last stage's body: the form and the few links that outlive the page. */
export function StageClose({ labels, invert = false }: { labels: CloseLabels; invert?: boolean }) {
  return (
    <div {...stylex.props(styles.close)}>
      <div {...stylex.props(styles.band)}>
        <div {...stylex.props(styles.bandCopy)}>
          <p {...stylex.props(styles.bandLabel)}>{labels.kicker}</p>
          <p {...stylex.props(styles.bandBody)}>{labels.body}</p>
          <p {...stylex.props(styles.bandNote)}>{labels.note}</p>
        </div>
        <div {...stylex.props(styles.bandForm)}>
          <WaitlistDarkForm tone="accent" layout="page" />
        </div>
      </div>
      {/* The middle row is empty on purpose: it is the space that pushes the
          colophon down to the foot of the stage. */}
      <span aria-hidden />
      <div {...stylex.props(styles.colophon, invert && styles.colophonOn)}>
        <div {...stylex.props(styles.links)}>
          <a
            {...stylex.props(styles.link, invert && styles.linkOn)}
            href={AppConfig.appUrl}
            target="_blank"
            rel="noreferrer"
          >
            {labels.app} ↗
          </a>
          <a
            {...stylex.props(styles.link, invert && styles.linkOn)}
            href={AppConfig.docsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {labels.docs} ↗
          </a>
          <a
            {...stylex.props(styles.link, invert && styles.linkOn)}
            href={`mailto:${AppConfig.email}`}
          >
            {labels.contact}
          </a>
        </div>
        <p {...stylex.props(styles.legal, invert && styles.legalOn)}>
          {labels.copyright} · {labels.disclaimer}
        </p>
      </div>
    </div>
  );
}
