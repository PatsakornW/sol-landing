import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Reveal } from '@/components/landing/Reveal';
import { media } from '../../styles/breakpoints.stylex';
import { color, font, space } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const styles = stylex.create({
  /* One screen, one idea. The stage owns the viewport rather than sharing it
     with the block above and below — which is the entire premise of this
     revision, and the reason nothing here is a card. */
  stage: {
    position: 'relative',
    display: 'grid',
    /* The one row stretches, so the stage's content owns the whole screen
       rather than a band in the middle of it — the head sits at the top and
       whatever the stage is about takes the rest. */
    alignContent: 'stretch',
    /* `min-height`, not `height`: a stage whose copy outgrows the screen — a
       long headline at a phone width, or a reader at 200% — must be allowed to get taller
       rather than clip its own tail. */
    minHeight: STAGE.screen,
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    paddingInline: space.pageInline,
    paddingBlock: { default: 72, [media.sm]: 88 },
    backgroundColor: color.surface3,
    overflow: 'hidden',
  },
  /* Alternate stages take the inverted ground, so scrolling reads as cutting
     between shots rather than as one long page. */
  invert: {
    backgroundColor: color.surface1,
    /* A literal, not `color.card`: `surface1` is a dark ground in both
       palettes, so its ink has to be light in both — and `card` is the page's
       raised surface, which is near-black once the reader picks dark. */
    color: '#f5f7fb',
  },
  inner: {
    display: 'grid',
    /* Kicker, headline, then everything else: the body takes the leftover
       height, which is what lets a list, a clip or a trace fill the shot. */
    gridTemplateRows: 'auto auto 1fr',
    width: '100%',
    maxWidth: 1180,
    marginInline: 'auto',
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: { default: 18, [media.sm]: 24 },
    fontFamily: font.mono,
    fontSize: 11.5,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: color.mutedFg,
  },
  headOn: {
    color: 'rgba(255, 255, 255, 0.62)',
  },
  num: {
    color: color.landingPrimary,
    fontVariantNumeric: 'tabular-nums',
  },
  rule: {
    flexGrow: 1,
    height: 1,
    backgroundColor: color.border,
  },
  ruleOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  /* Poster scale: the headline is the shot, and everything else on the stage
     is set relative to it. */
  title: {
    margin: 0,
    maxWidth: '16ch',
    fontSize: 'clamp(2.2rem, 6.4vw, 5rem)',
    fontWeight: 600,
    lineHeight: 0.98,
    letterSpacing: '-0.045em',
    color: color.fg,
    textWrap: 'balance',
  },
  titleOn: {
    color: '#f5f7fb',
  },
  lead: {
    margin: 0,
    marginTop: { default: 16, [media.sm]: 22 },
    maxWidth: '48ch',
    fontSize: { default: 16, [media.sm]: 19 },
    lineHeight: 1.55,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
  leadOn: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  body: {
    display: 'grid',
    /* Stretch, not centre: the body owns the rest of the screen, so a list
       spreads across it and the closing stage can put its colophon on the
       floor. Anything that must keep its own height — a clip, a row of
       plates — says so with `align-self` at its own end. */
    alignContent: 'stretch',
    marginTop: { default: 24, [media.sm]: 32 },
    minWidth: 0,
  },
});

/** One screen of the stage. */
export function Stage({
  id,
  num,
  label,
  title,
  lead,
  invert = false,
  children,
}: {
  id: string;
  num: string;
  label: string;
  title: string;
  lead?: string;
  invert?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      {...stylex.props(styles.stage, invert && styles.invert)}
      aria-labelledby={`${id}-title`}
    >
      <div {...stylex.props(styles.inner)}>
        <Reveal index={0}>
          <p {...stylex.props(styles.head, invert && styles.headOn)}>
            <span {...stylex.props(styles.num)}>{num}</span>
            {label}
            <span {...stylex.props(styles.rule, invert && styles.ruleOn)} aria-hidden />
          </p>
        </Reveal>
        <Reveal index={1}>
          <h2 id={`${id}-title`} {...stylex.props(styles.title, invert && styles.titleOn)}>
            {title}
          </h2>
          {lead ? <p {...stylex.props(styles.lead, invert && styles.leadOn)}>{lead}</p> : null}
        </Reveal>
        {children ? (
          <Reveal index={2} style={styles.body}>
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
