import * as stylex from '@stylexjs/stylex';

/**
 * Canvas geometry and timing for the home showcase clip.
 *
 * Split from the clip itself for the same reason as `mechanism/flow-timing.stylex.ts`:
 * `MarketPreview` needs these numbers to drive playback and must not pull
 * `remotion` into the page bundle to get them.
 *
 * The canvas holds `apps/web` at REAL desktop pixel sizes — a 1180px-wide app,
 * not a shrunk screenshot of a 1440px one. That is what keeps 12px app type
 * readable once `Thumbnail` fits the composition to the plate.
 *
 * Every number below is the app's own, and the totals are derived rather than
 * carried: `HOME_HEIGHT` and the plate's crop used to be hand-summed here, again
 * in `HomeFlow`, and a third time as literals in a `.showcase-plate` rule, with
 * three comments telling contributors to keep them in step. The plate's styles
 * now import these constants directly (`showcase-plate.styles.ts`), so nothing
 * else spells a composition pixel and there is one place to edit.
 *
 * The `.stylex.ts` extension is a compiler contract, not a claim that this is a
 * stylesheet: StyleX only inlines a cross-module value out of `defineConsts` or
 * `defineVars` in a `.stylex` file, so a plain `export const` cannot reach a
 * `stylex.create` block. `plateGeom` at the bottom is the handful of numbers the
 * plate's frame needs, in the form the compiler can read — derived here from the
 * same exports, so it is a projection rather than a second copy.
 */

export const HOME_FPS = 30;
/** ~5s play-once: brief hold at the top, scroll the route, hold on the markets band. */
export const HOME_DURATION = 150;
export const HOME_WIDTH = 1180;

/**
 * Scroll window, in frames. The plate is a fixed-height crop onto the full
 * composition; these bounds drive how far that crop slides from y=0 (nav) to
 * `CROP_TOP` (trending + cards). Outside the window the crop is clamped.
 */
export const SCROLL_START = 12;
export const SCROLL_END = 108;

/** `$container-padding`, tightened to 28 so the 1180 canvas holds the real grid. */
export const HOME_PAD = 28;

/** Content column inside the container padding. */
export const HOME_CONTENT = HOME_WIDTH - HOME_PAD * 2;

/* ── Vertical budget, in the order the route stacks it ────────────────────── */

/** `.app-nav`: a 56px brand row over a 40px tab row. */
export const NAV_ROW = 56;
export const NAV_TABS = 40;
export const NAV_H = NAV_ROW + NAV_TABS;

export const PAGE_TOP = 24;

/** `.discovery-stage` — the live series window. */
export const STAGE_H = 300;

/**
 * `.also-moving-rail--trending`: 28px header + 6 gap + three 32px-thumb chips
 * (4+32+6, 6+32+6, 6+32+0, with 1px dividers between them).
 *
 * Split rather than carried as one 160, because the crop below lands *between*
 * the two parts — it settles past the header and onto the chips. `HomeFlow`
 * spells the same 28 + 6 as `minHeight` + `gap` on the rail's header row; the
 * chips are not exported because nothing outside this file needs them.
 */
export const TRENDING_HEADER = 28 + 6;
const TRENDING_CHIPS = 126;
export const TRENDING_H = TRENDING_HEADER + TRENDING_CHIPS;

/** `.featured-hero` — stage and trending rail share one row. */
export const STAGE_TO_TRENDING = 16;
export const HERO_H = STAGE_H + STAGE_TO_TRENDING + TRENDING_H;

export const HERO_TO_TOOLBAR = 28;

/** `.markets-toolbar`: `min-height: 40px` + `padding: 8px 0` around 32px controls. */
export const TOOLBAR_H = 48;

export const TOOLBAR_TO_GRID = 14;
export const CARD_H = 236;

/**
 * A strip of ground under the card row, so it does not sit flush to the frame.
 * Deep enough that the card row's own bottom edge — footer text, the volume and
 * countdown line — clears the crop boundary instead of being cut by it.
 */
export const GROUND_TAIL = 34;

export const HOME_HEIGHT =
  NAV_H + PAGE_TOP + HERO_H + HERO_TO_TOOLBAR + TOOLBAR_H + TOOLBAR_TO_GRID + CARD_H + GROUND_TAIL;

/* ── The crop the plate shows ─────────────────────────────────────────────── */

/**
 * Settled crop: after the scroll finishes, the plate rests on the band that
 * starts just past the trending rail's header — its ranked chips, the markets
 * toolbar, and the first row of event-group cards. The scroll itself starts at
 * y=0 so the viewer first sees the navbar and live stage, then pans into this
 * band.
 *
 * Derived from landmarks rather than picked: the crop stops on the rail's first
 * chip, so the offset is everything above the chips — nav, page padding, the
 * series stage, the gap under it, and the rail's own header. Scrolling deeper
 * necessarily shortens the frame, since the pan already ends flush with the
 * composition's bottom (`CROP_TOP + CROP_HEIGHT === HOME_HEIGHT`).
 */
export const CROP_TOP = NAV_H + PAGE_TOP + STAGE_H + STAGE_TO_TRENDING + TRENDING_HEADER;
export const CROP_HEIGHT = HOME_HEIGHT - CROP_TOP;

/* ── The same crop, for a phone ───────────────────────────────────────────── */

/**
 * A phone cannot hold 1180 composition pixels and stay legible — fitted whole
 * to a 358px stage the app's 12px type lands at 3.6px. So the compact plate
 * shows a *slice* of the canvas instead of the whole width: the screen is laid
 * out `ZOOM` times wider than the frame and the frame clips it.
 *
 * 2.6 puts the app back at ~0.79 scale (12px type ≈ 9.5px, the same order as
 * the static stand-in it replaces) and still shows 454 composition pixels —
 * the nav brand, the toolbar, and a card and a half. Below ~2.2 the type stops
 * being readable; above ~3 the slice stops reading as an interface.
 */
export const COMPACT_ZOOM = 2.6;

/** Portrait frame: a phone has the vertical room a 1180-wide crop does not. */
export const COMPACT_FRAME_W = 4;
export const COMPACT_FRAME_H = 5;

/** Composition pixels the compact frame can show at once, height and width. */
export const COMPACT_VISIBLE_W = HOME_WIDTH / COMPACT_ZOOM;
export const COMPACT_VISIBLE_H = (COMPACT_VISIBLE_W * COMPACT_FRAME_H) / COMPACT_FRAME_W;

/**
 * Where the compact scroll settles. Derived, not chosen: the crop stops with
 * its bottom edge on the composition's bottom edge, so the pan ends on the card
 * row with no empty ground below it. The desktop crop satisfies the same
 * identity by construction (`CROP_TOP + CROP_HEIGHT === HOME_HEIGHT`).
 */
export const COMPACT_CROP_TOP = HOME_HEIGHT - COMPACT_VISIBLE_H;

/* ── Horizontal grid ─────────────────────────────────────────────────────── */

/** `.featured-hero` is `minmax(0, 1.45fr) minmax(260px, 0.85fr)` with a 24 gap. */
export const HERO_GAP = 24;
export const HERO_LEFT = Math.round(((HOME_CONTENT - HERO_GAP) * 1.45) / 2.3);
export const HERO_RIGHT = HOME_CONTENT - HERO_GAP - HERO_LEFT;

/** `.insight-grid` at `xl`: 4 columns, 16px column gap. */
export const GRID_GAP = 16;
export const CARD_W = Math.round((HOME_CONTENT - GRID_GAP * 3) / 4);

/* ── The same geometry, in the form `stylex.create` can read ─────────────── */

/**
 * Only the ratios the plate's frame and screen need — the two aspect ratios and
 * the portrait frame. Everything else above stays a plain export, because only
 * playback code reads it.
 */
export const plateGeom = stylex.defineConsts({
  /** Desktop frame: the composition's width over the settled crop's height. */
  cropRatio: `${HOME_WIDTH} / ${CROP_HEIGHT}`,
  /** The screen itself: the whole composition, panned inside the frame. */
  screenRatio: `${HOME_WIDTH} / ${HOME_HEIGHT}`,
  /** Phone frame: a portrait slice of the canvas rather than the full width. */
  compactRatio: `${COMPACT_FRAME_W} / ${COMPACT_FRAME_H}`,
});
