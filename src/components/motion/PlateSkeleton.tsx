import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';

/**
 * The placeholder every plate shows before its clip is on screen.
 *
 * It renders into the plate's own frame styles rather than a box of its own, so
 * the frame — aspect ratio, crop, reveal transition — is declared once and the
 * swap to the clip changes only what is inside it. That is why this takes a
 * `frame` prop: a skeleton with its own box would have to restate the frame and
 * would drift from it.
 *
 * Two moments use it, and they must look identical or the sequence reads as two
 * different loads: the server render and first client render (before `usePlate`
 * latches), and the window while the lazy Remotion chunk downloads.
 */

/** One sweep across a flat wash, right to left. */
const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

/**
 * The wash, per plate ground.
 *
 * Two grounds exist and the placeholder has to read on both: the showcase plate
 * is the app's near-black, the mechanism plates are cream print stock. This used
 * to be a descendant selector — `.mechanism-card__plate .plate-skeleton__bar`
 * reaching down from the frame — which meant the skeleton's appearance was
 * decided by an ancestor it had no knowledge of. It is a prop now, so the frame
 * and the tone are chosen at the same call site.
 *
 * Spelled out per ground rather than built by a helper: StyleX evaluates these
 * at build time and its evaluator will not call a function, so a `wash(from,
 * to)` shared between the two fails the compile ("Unsupported expression").
 *
 * At 4.5% white (or 8% ink on paper) the shape reads as a placeholder, not as a
 * control the viewer might try to use; the sheen stop is roughly double that.
 */
const DARK_BASE = 'rgba(255, 255, 255, 0.045)';
const DARK_SHEEN = 'rgba(255, 255, 255, 0.1)';
const PAPER_BASE = 'rgba(24, 24, 27, 0.08)';
const PAPER_SHEEN = 'rgba(24, 24, 27, 0.16)';

const DARK_WASH = `linear-gradient(90deg, ${DARK_BASE} 0%, ${DARK_BASE} 42%, ${DARK_SHEEN} 50%, ${DARK_BASE} 58%, ${DARK_BASE} 100%) 0 0 / 300% 100%`;
const PAPER_WASH = `linear-gradient(90deg, ${PAPER_BASE} 0%, ${PAPER_BASE} 42%, ${PAPER_SHEEN} 50%, ${PAPER_BASE} 58%, ${PAPER_BASE} 100%) 0 0 / 300% 100%`;

const styles = stylex.create({
  /* Fills whichever frame it is given, so the frame's aspect ratio does the
     layout and this never reserves a box of its own. */
  skeleton: {
    position: 'absolute',
    zIndex: 1,
    inset: 0,
    /* Scripting off: no clip is ever coming, so the prose description takes the
       frame and the placeholder blocks — which would now be lying — come out. */
    display: {
      default: 'flex',
      [media.noScript]: 'none',
    },
    flexDirection: 'column',
    gap: '4.5%',
    padding: '7%',
  },
  shape: {
    display: 'block',
    borderRadius: 4,
    /* A sweeping highlight is exactly the kind of idle motion reduced-motion
       asks to be spared. The blocks stay, at the wash's resting value. */
    animationName: {
      default: sweep,
      [media.reduce]: 'none',
    },
    animationDuration: '1.6s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  darkShape: {
    background: {
      default: DARK_WASH,
      [media.reduce]: 'rgba(255, 255, 255, 0.055)',
    },
  },
  paperShape: {
    background: {
      default: PAPER_WASH,
      [media.reduce]: 'rgba(24, 24, 27, 0.1)',
    },
  },
  kicker: { width: '22%', height: '7%' },
  title: { width: '68%', height: '11%' },
  foot: { width: '40%', height: '7%' },
  pair: {
    display: 'flex',
    flexGrow: 1,
    gap: '4.5%',
    minHeight: 0,
  },
  block: {
    flexGrow: 1,
    borderRadius: 6,
  },
  /**
   * What the clip shows, in words.
   *
   * The plates used to be backed by hand-built CSS copies of the real UI, so a
   * crawler or a scripting-off browser got a genuine description of the product
   * as markup. Replacing those with abstract blocks took that away. This is the
   * same guarantee at a fraction of the cost: one sentence per plate, always in
   * the HTML, never a second implementation of the app to keep in sync.
   *
   * Hidden by default rather than removed — `content-visibility` and `display:
   * none` both take it out of the accessibility tree *and* devalue it for
   * indexing, and the point is that it stays readable to anything parsing the
   * page. `aria-hidden` on the wrapper keeps it out of a screen reader's way,
   * which already has the card's own copy.
   */
  fallback: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  /**
   * The same paragraph, un-hidden, when nothing will ever paint over it.
   *
   * Every declaration is scoped to the query rather than the block being scoped
   * as a whole: a condition in StyleX belongs to a property, which is what lets
   * the breakpoint itself be an imported constant.
   */
  fallbackVisible: {
    position: { default: null, [media.noScript]: 'static' },
    display: { default: null, [media.noScript]: 'flex' },
    alignItems: { default: null, [media.noScript]: 'center' },
    width: { default: null, [media.noScript]: 'auto' },
    height: { default: null, [media.noScript]: '100%' },
    margin: { default: null, [media.noScript]: 0 },
    padding: { default: null, [media.noScript]: '9%' },
    overflow: { default: null, [media.noScript]: 'visible' },
    clip: { default: null, [media.noScript]: 'auto' },
    fontSize: { default: null, [media.noScript]: 13 },
    lineHeight: { default: null, [media.noScript]: 1.6 },
    whiteSpace: { default: null, [media.noScript]: 'normal' },
    textWrap: { default: null, [media.noScript]: 'pretty' },
  },
  fallbackDark: { color: color.appTextSecondary },
  fallbackPaper: { color: color.paperInk },
});

export interface PlateSkeletonProps {
  /**
   * The frame this stands in for — `showcasePlate.frame` or
   * `mechanismPlate.frame`, plus whatever reveal state the caller is in. Both
   * live in their own style module precisely so they can be handed across a
   * lazy-import boundary without dragging `remotion` along.
   */
  frame: StyleXStyles;
  /** Which ground the frame paints, so the wash reads against it. */
  tone: 'dark' | 'paper';
  /**
   * What the clip shows, in words. Kept in the markup so the page still says
   * what the product looks like to a reader that never runs the clip — a
   * crawler, or a browser with scripting off, which sees this in place of the
   * blocks. Omit it where the render is known to be scripted (the lazy chunk's
   * `loading` state), since nothing there will ever read it.
   */
  description?: string;
}

export function PlateSkeleton({ frame, tone, description }: PlateSkeletonProps) {
  const shape = tone === 'paper' ? styles.paperShape : styles.darkShape;

  return (
    // Decorative: the copy beside the plate already says what the product does,
    // and a screen reader has nothing to gain from an announced placeholder or
    // from a second prose description of it.
    <div {...stylex.props(frame)} aria-hidden>
      {description ? (
        <p
          {...stylex.props(
            styles.fallback,
            styles.fallbackVisible,
            tone === 'paper' ? styles.fallbackPaper : styles.fallbackDark,
          )}
        >
          {description}
        </p>
      ) : null}
      <div {...stylex.props(styles.skeleton)}>
        <span {...stylex.props(styles.shape, shape, styles.kicker)} />
        <span {...stylex.props(styles.shape, shape, styles.title)} />
        <div {...stylex.props(styles.pair)}>
          <span {...stylex.props(styles.shape, shape, styles.block)} />
          <span {...stylex.props(styles.shape, shape, styles.block)} />
        </div>
        <span {...stylex.props(styles.shape, shape, styles.foot)} />
      </div>
    </div>
  );
}
