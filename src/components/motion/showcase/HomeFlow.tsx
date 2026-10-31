'use client';

import Bbc from '@thesvg/react/bbc';
import Cnn from '@thesvg/react/cnn';
import Espn from '@thesvg/react/espn';
import Fifa from '@thesvg/react/fifa';
import GoldmanSachs from '@thesvg/react/goldman-sachs';
import Imdb from '@thesvg/react/imdb';
import NewYorkTimes from '@thesvg/react/new-york-times';
import { memo, type CSSProperties, type ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

import {
  BG,
  BORDER,
  clamp,
  FONT,
  NO,
  R_CARD,
  R_CHIP,
  R_CTRL,
  SURFACE,
  SURFACE_CARD,
  TEXT,
  TEXT_MUTED,
  TEXT_SECONDARY,
  text,
  YES,
} from '@/components/motion/app-tokens';
import {
  CARDS,
  NEWS,
  SERIES,
  TRENDING,
  WALLET,
  type GridCard,
  type ShowcaseBrand,
} from '@/components/motion/sample-data';
import {
  CARD_H,
  CARD_W,
  GRID_GAP,
  HERO_GAP,
  HERO_H,
  HERO_LEFT,
  HERO_RIGHT,
  HERO_TO_TOOLBAR,
  HOME_CONTENT,
  HOME_PAD,
  NAV_ROW,
  NAV_TABS,
  PAGE_TOP,
  STAGE_H,
  STAGE_TO_TRENDING,
  TOOLBAR_H,
  TOOLBAR_TO_GRID,
  TRENDING_H,
} from './home-timing.stylex';

/**
 * The `apps/web` home route as a visitor first meets it: navbar, the discovery
 * band (news rail · live series stage · trending), the markets toolbar, and the
 * top of the event-group grid.
 *
 * Same contract as `mechanism/MechanismFlows.tsx` — a replica at the app's real
 * proportions, not a shrunk screenshot. Colours and radii come from
 * `motion/app-tokens.ts`, the sample markets from `motion/sample-data.ts`, and
 * the canvas geometry from `home-timing.stylex.ts`; nothing here is a second opinion of
 * any of the three.
 *
 * The canvas is the whole route. The plate scrolls a fixed-height crop from the
 * top (nav + stage) down to the markets band (`CROP_TOP` in `home-timing.stylex.ts`),
 * so this composition stays fully painted — the motion is the plate's scroll,
 * not staggered fade-ins of individual chrome.
 *
 * Card anatomy is audited against the app rather than eyeballed: surfaces are the
 * `mc-*` pair, the trending rail is a ranked list with no pill backgrounds, the
 * insight-card footer carries no rule, and one grid card runs the `headline`
 * cover variant the way `resolveCardLayout` picks it per market.
 */

/* Tokens unique to this clip. The shared list lives in `motion/app-tokens.ts`;
   these are the ones only the home route uses. */

/* `$mc-surface` / `$mc-border` — the browsable list-item pair (see `card()`). */
const MC_SURFACE = '#282828';
const MC_BORDER = '#333333';
const TEXT_LIGHT = '#8a8a8a';
const ACCENT = '#2078ff';
/* `$media-scrim` / `$media-ink` — the pair every cover masthead is washed with. */
const SCRIM = '10, 10, 10';
const INK = '#ffffff';

/* The letter-fallback surface behind a missing thumb, shared by the insight-card
   header slot and the trending rail thumb (both cite the same recipe in SCSS). */
const THUMB_FALLBACK = `linear-gradient(135deg, rgba(32,120,255,0.22), rgba(32,120,255,0.06))`;

/**
 * Official brand marks from `@thesvg/react` (GLINCKER/thesvg). Light plate so
 * dark logos (NYT, BBC) and yellow marks (IMDb) stay legible on the dark UI.
 * Rendered per-slug rather than through a shared component type — each icon
 * pins its own `variant` union and they do not unify under one React type.
 */
function BrandThumb({
  brand,
  size,
  iconSize,
  radius = R_CTRL,
}: {
  brand: ShowcaseBrand;
  size: number;
  iconSize: number;
  radius?: number;
}) {
  const dims = { width: iconSize, height: iconSize, 'aria-hidden': true as const };
  let mark: ReactNode;
  switch (brand) {
    case 'goldman-sachs':
      mark = <GoldmanSachs {...dims} />;
      break;
    case 'imdb':
      mark = <Imdb {...dims} />;
      break;
    case 'espn':
      mark = <Espn {...dims} />;
      break;
    case 'fifa':
      mark = <Fifa {...dims} />;
      break;
    case 'new-york-times':
      mark = <NewYorkTimes {...dims} />;
      break;
    case 'cnn':
      mark = <Cnn {...dims} />;
      break;
    case 'bbc':
      mark = <Bbc {...dims} />;
      break;
  }

  return (
    <span
      style={{
        ...row,
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        background: '#f4f4f5',
        overflow: 'hidden',
      }}
    >
      {mark}
    </span>
  );
}

/* `$radius-*` beyond the shared three. */
const R_HERO = 18;
const R_FULL = 9999;

const nums: CSSProperties = { fontVariantNumeric: 'tabular-nums' };

/* `@include text-clamp(n)` — the app truncates rather than reflows, which is what
   keeps every card the same 236px tall no matter how long a market title is. */
const clampLines = (lines: number): CSSProperties => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  overflow: 'hidden',
});

/* Browsable list-item surface — `$mc-surface` / `$mc-border`, NOT
   `$surface-card`. The insight cards, the news covers, best-pick and the hero all
   sit on the `mc-*` pair in `_theme.scss`; `$surface-card` (#262626) is for
   chrome like the navbar wallet pill. */
const card = (extra?: CSSProperties): CSSProperties => ({
  background: MC_SURFACE,
  border: `1px solid ${MC_BORDER}`,
  borderRadius: R_CARD,
  ...extra,
});

const row: CSSProperties = { display: 'flex', alignItems: 'center' };

/* `.discovery-ptb` / `.discovery-live-price` — the settled-against pair under the
   series window. One box, rendered twice: the only thing that differs is what is
   printed in it. */
const STAT_BOX: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '11px 13px',
  borderRadius: R_CTRL,
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.08)',
};

/* ── Navbar ───────────────────────────────────────────────────────────────── */

const TABS = ['All', 'Politics', 'Sports', 'Culture', 'Economics', 'Tech'] as const;

/** Two rows: brand + actions (60px in the app, 56 here), then category tabs. */
const Navbar = memo(function Navbar() {
  return (
    <div style={{ background: BG }}>
      <div
        style={{
          ...row,
          justifyContent: 'space-between',
          height: NAV_ROW,
          padding: `0 ${HOME_PAD}px`,
          gap: 16,
        }}
      >
        <div style={{ ...row, gap: 10 }}>
          <span
            style={{
              ...row,
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: R_CTRL,
              background: ACCENT,
              ...text(13, '#fff', 700),
            }}
          >
            S
          </span>
          <span style={text(15, TEXT, 700)}>SolsMarket</span>
        </div>

        {/* Search — `.navbar-search` sits centred between brand and actions. */}
        <div
          style={{
            ...row,
            gap: 8,
            flex: '0 1 320px',
            height: 34,
            padding: '0 12px',
            borderRadius: R_CTRL,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            ...text(12, TEXT_MUTED),
          }}
        >
          <span style={{ opacity: 0.7 }}>⌕</span>
          Search markets
        </div>

        <div style={{ ...row, gap: 8 }}>
          <span
            style={{
              ...row,
              justifyContent: 'center',
              height: 32,
              padding: '0 14px',
              borderRadius: R_CTRL,
              background: YES,
              ...text(12, '#0d2318', 600),
            }}
          >
            Deposit
          </span>
          <span
            style={{
              ...row,
              justifyContent: 'center',
              gap: 7,
              height: 32,
              padding: '0 12px',
              borderRadius: R_CTRL,
              background: SURFACE_CARD,
              border: `1px solid ${BORDER}`,
              ...text(12, TEXT, 600),
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: R_FULL, background: YES }} />
            {WALLET}
          </span>
        </div>
      </div>

      {/* Row 2 — `.nav-tabs`: full-height text tabs with an accent underline. */}
      <div
        style={{
          ...row,
          gap: 22,
          height: NAV_TABS,
          padding: `0 ${HOME_PAD}px`,
          boxShadow: `inset 0 -1px 0 ${BORDER}`,
        }}
      >
        {TABS.map((tab, index) => (
          <span
            key={tab}
            style={{
              ...row,
              height: '100%',
              boxShadow: index === 0 ? `inset 0 -2px 0 ${ACCENT}` : undefined,
              ...text(12.5, index === 0 ? TEXT : TEXT_SECONDARY, index === 0 ? 600 : 500),
            }}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
});

/* ── Discovery band · left news rail ──────────────────────────────────────── */

/**
 * One row of the rail, and of the grid's headline card — the same four fields
 * either surface needs. Kept structural rather than tied to `HeroNewsItem` so
 * the composition stays independent of where the copy came from: the sample
 * rows in `motion/sample-data.ts` satisfy it too.
 */
type ShowcaseNewsItem = {
  cover: string;
  kicker: string;
  title: string;
  meta: string;
};

/** `.also-moving-rail--news`: section header, then a stack of cover cards. */
const NewsRail = memo(function NewsRail({ items }: { items: readonly ShowcaseNewsItem[] }) {
  const cardH = Math.round((HERO_H - 22 - 12 - 12) / 2);

  return (
    <div
      style={{
        width: HERO_LEFT,
        height: HERO_H,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ ...row, justifyContent: 'space-between', height: 22 }}>
        <span style={text(13, TEXT, 600)}>Latest news</span>
        <span style={text(11.5, TEXT_MUTED)}>Explore →</span>
      </div>

      {items.map((item) => (
        <div
          key={item.title}
          style={card({
            position: 'relative',
            // `$radius-hero`, not the card radius — the news covers and the
            // series hero are the two surfaces on the larger corner.
            borderRadius: R_HERO,
            height: cardH,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          })}
        >
          <img
            src={item.cover}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* `.insight-card__cover-scrim` — the copy sits on a bottom wash. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(12,12,12,0.92) 0%, rgba(12,12,12,0.55) 38%, transparent 72%)',
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: 14,
            }}
          >
            <span
              style={{
                ...text(10, TEXT, 700),
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
                padding: '3px 7px',
                borderRadius: R_CHIP,
                background: 'rgba(255,255,255,0.14)',
              }}
            >
              {item.kicker}
            </span>
            {/* `$font-size-md2` / `$font-size-xs` — the rail's own title + meta. */}
            <span style={{ ...text(15, INK, 600), lineHeight: 1.25 }}>{item.title}</span>
            <span style={text(12, 'rgba(255,255,255,0.62)')}>{item.meta}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

/* ── Discovery band · series stage ────────────────────────────────────────── */

/**
 * `SeriesDiscoveryStage`: fixed 320px envelope in the app (300 here), a mesh
 * backdrop that stays dark in both themes, a live badge, the window clock, the
 * threshold / consensus pair, and the phase CTA.
 */
function SeriesStage({ frame }: { frame: number }) {
  // The live consensus is the one number that still moves while the plate
  // scrolls — a quiet pulse so the stage reads as live, not a still.
  const drift = interpolate(frame, [0, 44, 82, 120, 149], [0, 1, 0.32, 0.94, 0.66], clamp);
  const consensus = SERIES.currentBase + drift * SERIES.currentDrift;
  const threshold = 2.5;
  const delta = consensus - threshold;
  const under = consensus < threshold;

  // One window tick per second — the countdown is a clock, not a loader.
  const left = Math.max(0, 8 * 60 + 42 - Math.floor(frame / 30));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: STAGE_H,
        borderRadius: R_HERO,
        border: `1px solid ${MC_BORDER}`,
        background: MC_SURFACE,
        overflow: 'hidden',
      }}
    >
      {/* Cool policy mesh that does not flip with the theme, plus the scrim. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(72% 58% at 82% 6%, rgba(61,120,255,0.38) 0%, transparent 62%),' +
            'radial-gradient(58% 52% at 12% 92%, rgba(80,140,255,0.18) 0%, transparent 66%),' +
            'linear-gradient(148deg, #141c2e 0%, #121824 52%, #10141c 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(12,16,24,0.78) 0%, transparent 58%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 18,
          gap: 14,
        }}
      >
        <div style={{ ...row, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ ...row, gap: 10 }}>
            <BrandThumb brand={SERIES.brand} size={34} iconSize={20} radius={R_FULL} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ ...row, gap: 6 }}>
                <span
                  style={{
                    ...row,
                    gap: 5,
                    padding: '3px 7px',
                    borderRadius: R_CHIP,
                    background: 'rgba(224,90,90,0.2)',
                    ...text(9, '#ff8a8a', 700),
                    letterSpacing: '0.08em',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: R_FULL, background: NO }} />
                  LIVE
                </span>
                <span style={text(10.5, 'rgba(255,255,255,0.6)')}>{SERIES.windowLabel}</span>
              </span>
              <span style={{ ...text(17, '#fff', 600), letterSpacing: '-0.02em' }}>
                {SERIES.question}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={text(9.5, 'rgba(255,255,255,0.55)')}>Closes in</span>
            <span style={{ ...text(20, '#fff', 600), ...nums, letterSpacing: '-0.02em' }}>
              {mm}:{ss}
            </span>
          </div>
        </div>

        {/* Threshold + live consensus — the pair the window settles against. */}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          <div style={STAT_BOX}>
            <span style={text(9.5, 'rgba(255,255,255,0.55)')}>{SERIES.thresholdLabel}</span>
            <span style={{ ...text(19, '#fff', 600), ...nums }}>{SERIES.threshold}</span>
          </div>
          <div style={STAT_BOX}>
            <span style={text(9.5, 'rgba(255,255,255,0.55)')}>{SERIES.currentLabel}</span>
            <span style={{ ...row, gap: 7 }}>
              <span style={{ ...text(19, under ? YES : NO, 600), ...nums }}>
                {consensus.toFixed(2)}%
              </span>
              <span style={{ ...text(11, under ? YES : NO, 600), ...nums }}>
                {under ? '▼' : '▲'} {Math.abs(delta).toFixed(2)}
              </span>
            </span>
          </div>
        </div>

        <div style={{ ...row, justifyContent: 'space-between', gap: 12 }}>
          <span style={text(10.5, 'rgba(255,255,255,0.6)')}>{SERIES.settleHint}</span>
          <span
            style={{
              ...row,
              justifyContent: 'center',
              height: 34,
              padding: '0 16px',
              borderRadius: R_CTRL,
              background: '#fff',
              ...text(12, '#18181b', 600),
            }}
          >
            {SERIES.cta}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Discovery band · trending rail ───────────────────────────────────────── */

/**
 * `AlsoMovingRail sections="trending"` — a ranked list, not a strip of pills.
 * Each chip is rank · 32px thumb · title over a percent/volume meta row, and the
 * chips are separated by hairline dividers on a transparent ground
 * (`also-moving-rail/_trending.scss`). The percent is `$text-primary`: the rail
 * ranks markets, it does not report direction, so there are no green/red arrows.
 */
const TrendingRail = memo(function TrendingRail() {
  return (
    <div
      style={{
        height: TRENDING_H,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ ...row, justifyContent: 'space-between', minHeight: 28 }}>
        <span style={text(13, TEXT, 600)}>Trending</span>
        <span style={text(12, TEXT_SECONDARY)}>Explore →</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TRENDING.map((item, index) => (
          <div
            key={item.name}
            style={{
              ...row,
              gap: 10,
              paddingTop: index === 0 ? 4 : 6,
              paddingBottom: index === TRENDING.length - 1 ? 0 : 6,
              borderTop: index === 0 ? undefined : '1px solid rgba(51,51,51,0.7)',
            }}
          >
            <span style={{ ...text(12, TEXT_MUTED, 600), ...nums, width: 14, textAlign: 'center' }}>
              {index + 1}
            </span>
            {item.brand ? (
              <BrandThumb brand={item.brand} size={32} iconSize={18} radius={R_CHIP} />
            ) : (
              <span
                style={{
                  ...row,
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: R_CHIP,
                  background: THUMB_FALLBACK,
                  ...text(12, TEXT_SECONDARY, 700),
                }}
              >
                {item.name.charAt(0)}
              </span>
            )}
            <span
              style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}
            >
              <span
                style={{
                  ...text(13, TEXT),
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.name}
              </span>
              <span style={{ ...row, gap: 8, ...nums, fontSize: 12 }}>
                <span style={text(12, TEXT, 600)}>{item.pct}%</span>
                <span style={text(12, TEXT_SECONDARY)}>{item.vol} Vol.</span>
              </span>
            </span>
            <span style={text(12, TEXT_MUTED)}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ── Markets toolbar ──────────────────────────────────────────────────────── */

/**
 * One filter control. Module scope, not a closure inside `Toolbar`: it reads
 * only module constants, and this is a Remotion clip — the component renders
 * once per frame, so a function rebuilt in its body is rebuilt 132 times per
 * play rather than once.
 */
const pill = (label: string, active = false): ReactNode => (
  <span
    key={label}
    style={{
      ...row,
      gap: 6,
      height: 32,
      padding: '0 12px',
      borderRadius: R_CTRL,
      border: `1px solid ${BORDER}`,
      background: active ? SURFACE_CARD : 'transparent',
      ...text(13, active ? TEXT : TEXT_SECONDARY, 600),
    }}
  >
    {label}
    <span style={{ ...text(9, TEXT_MUTED), marginTop: 1 }}>▼</span>
  </span>
);

/** `.markets-toolbar`: section title left, dropdowns + bookmark filter right. */
const Toolbar = memo(function Toolbar() {
  /* `$font-size-sm2` on the controls, `$font-size-lg` + `$letter-spacing-tight`
     on the title — the toolbar band is `min-height: 40` plus 8px of padding. */

  return (
    <div
      style={{
        ...row,
        justifyContent: 'space-between',
        height: TOOLBAR_H,
      }}
    >
      <span style={{ ...text(20, TEXT, 600), letterSpacing: '-0.025em' }}>All Events</span>
      <div style={{ ...row, gap: 8 }}>
        {pill('Trending', true)}
        {pill('Open')}
        {pill('All types')}
        <span
          style={{
            ...row,
            gap: 4,
            height: 32,
            padding: '0 12px',
            borderRadius: R_CTRL,
            border: `1px solid ${BORDER}`,
            ...text(13, TEXT_SECONDARY, 600),
          }}
        >
          ☆ Bookmarked
        </span>
      </div>
    </div>
  );
});

/* ── Event-group grid ─────────────────────────────────────────────────────── */

/**
 * `ChanceMeter` — 48px column: 18px value, 10px caption, and the 3px split bar
 * under both. The bar is the part a screenshot-style replica usually drops, and
 * it is the only thing on the card that reads as a gauge rather than a number.
 */
function ChanceMeter({ pct }: { pct: number }) {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        width: 48,
        gap: 1,
        lineHeight: 1,
      }}
    >
      <span style={{ ...text(18, TEXT, 700), ...nums, lineHeight: 1.05 }}>{pct}%</span>
      <span style={text(10, TEXT_SECONDARY, 600)}>chance</span>
      <span
        style={{
          display: 'flex',
          width: '100%',
          height: 3,
          marginTop: 3,
          borderRadius: R_FULL,
          overflow: 'hidden',
          background: 'rgba(229,229,229,0.1)',
        }}
      >
        <span style={{ width: `${pct}%`, background: YES }} />
        <span style={{ width: `${100 - pct}%`, background: NO }} />
      </span>
    </span>
  );
}

/**
 * `.insight-card--headline` — the cover variant. No chrome: the image fills the
 * shell, a scrim carries the masthead, the chance meter moves to the top-right in
 * `$media-ink`, and the kicker/title pair sits on the bottom bar. One of the four
 * grid cards uses it, the way the app's `resolveCardLayout` picks it per market.
 */
function HeadlineCard({
  data,
  width = CARD_W,
}: {
  data: Extract<GridCard, { kind: 'headline' }>;
  width?: number;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: CARD_H,
        borderRadius: R_CARD,
        overflow: 'hidden',
        background: MC_SURFACE,
      }}
    >
      <img
        src={data.cover}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // `.insight-card__cover-media` — desaturated a touch so the masthead
          // reads as print rather than feed.
          filter: 'contrast(1.05) saturate(0.92)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `linear-gradient(220deg, rgba(${SCRIM},0.42) 0%, transparent 42%),` +
            `linear-gradient(to top, rgba(${SCRIM},0.9) 0%, rgba(${SCRIM},0.55) 38%,` +
            ` rgba(${SCRIM},0.12) 68%, transparent 100%)`,
        }}
      />

      {/* Top-right cluster: the meter inverted onto the photo. */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 12 }}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            width: 56,
            gap: 1,
          }}
        >
          <span style={{ ...text(20, INK, 800), ...nums, letterSpacing: '-0.02em' }}>
            {data.pct}%
          </span>
          <span
            style={{
              ...text(10, 'rgba(255,255,255,0.72)', 600),
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            chance
          </span>
          <span
            style={{
              display: 'flex',
              width: '100%',
              height: 3,
              marginTop: 3,
              borderRadius: 1,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.22)',
            }}
          >
            <span style={{ width: `${data.pct}%`, background: YES }} />
          </span>
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: 12,
        }}
      >
        <span
          style={{
            ...text(10, 'rgba(255,255,255,0.7)', 700),
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}
        >
          {data.kicker}
        </span>
        {/* `$font-size-md` is 18px — the masthead is the largest type in the grid. */}
        <span
          style={{
            ...text(18, INK, 700),
            ...clampLines(3),
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            maxWidth: 240,
          }}
        >
          {data.title}
        </span>
      </div>
    </div>
  );
}

/**
 * `.insight-card` anatomy: 12px top pad, a 48px header (48px thumb · 13px title ·
 * chance meter), the body, then the 36px meta footer.
 *
 * The body is where the two kinds differ. Binary: the buy block IS the body, so
 * the Yes/No pair is centred in the band rather than pinned under the header
 * (`.insight-card__body.insight-card__buy`). Multi: three 36px outcome rows on a
 * transparent ground — the leader is marked by tinting its percent `$ic-yes`, not
 * by a filled row — then the centred "+N more" link.
 */
const InsightCard = memo(function InsightCard({
  data,
  width = CARD_W,
}: {
  data: GridCard;
  width?: number;
}) {
  if (data.kind === 'headline') return <HeadlineCard data={data} width={width} />;

  return (
    <div
      style={card({
        width,
        height: CARD_H,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 12,
        overflow: 'hidden',
      })}
    >
      <div style={{ ...row, gap: 10, height: 48, padding: '0 12px' }}>
        {/* Official thesvg brand mark on a light plate — reads cleaner than a
            stretched logo at the app's full 48 thumb slot. */}
        <BrandThumb brand={data.brand} size={48} iconSize={28} />
        <span
          style={{
            ...text(13, TEXT, 600),
            ...clampLines(2),
            flex: 1,
            minWidth: 0,
            lineHeight: 1.35,
          }}
        >
          {data.title}
        </span>
        {data.kind === 'binary' ? <ChanceMeter pct={data.pct} /> : null}
      </div>

      {data.kind === 'binary' ? (
        <div style={{ ...row, flex: 1, minHeight: 0, gap: 8, padding: '0 12px' }}>
          {/* `rgba($ic-yes, 0.15)` / `rgba($ic-no, 0.12)` — the no side is a shade
              softer on purpose, so the pair does not read as equally weighted. */}
          {[
            { label: 'Yes', color: YES, tint: '26' },
            { label: 'No', color: NO, tint: '1f' },
          ].map((side) => (
            <span
              key={side.label}
              style={{
                ...row,
                justifyContent: 'center',
                flex: 1,
                height: 36,
                // `$radius-2xs`-adjacent 4px, not the 8px button radius.
                borderRadius: 4,
                background: `${side.color}${side.tint}`,
                ...text(13, side.color, 600),
              }}
            >
              {side.label}
            </span>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            padding: '2px 12px',
          }}
        >
          {data.rows.map((outcome, index) => (
            <div
              key={outcome.name}
              style={{
                ...row,
                justifyContent: 'space-between',
                gap: 8,
                height: 36,
                padding: '0 6px',
                margin: '0 -6px',
                borderRadius: R_CHIP,
              }}
            >
              <span style={{ ...text(14, TEXT, 450), flex: 1, minWidth: 0 }}>{outcome.name}</span>
              <span
                style={{
                  ...text(16, index === 0 ? YES : TEXT, 600),
                  ...nums,
                  minWidth: '2.5em',
                  textAlign: 'right',
                  lineHeight: 1,
                }}
              >
                {outcome.pct}%
              </span>
            </div>
          ))}
          <span
            style={{
              ...row,
              justifyContent: 'center',
              marginTop: 'auto',
              height: 24,
              ...text(12, TEXT_MUTED),
              lineHeight: 1,
            }}
          >
            +2 more
          </span>
        </div>
      )}

      {/* No rule above the footer in the app — the band is held by `margin-top:
          auto` alone, and vol/countdown carry their own tones. The volume is bare
          text (`.insight-card__vol-inline`); there is no coin glyph beside it. */}
      <div style={{ ...row, gap: 8, height: 36, padding: '0 12px', marginTop: 'auto' }}>
        <span style={{ ...text(12, TEXT_SECONDARY), ...nums }}>{data.vol} Vol.</span>
        <span style={{ ...text(12, TEXT_LIGHT), ...nums, marginLeft: 'auto' }}>{data.left}</span>
      </div>
    </div>
  );
});

/* ── Composition ──────────────────────────────────────────────────────────── */

export function HomeFlow({
  cards,
  background = BG,
}: {
  /**
   * How many grid cards to draw. Defaults to all of them; a caller showing the
   * composition as scenery rather than as a screenshot can ask for fewer, and
   * the ones that remain widen to fill the row — a short row of four-up cards
   * would leave bare ground down the right.
   */
  cards?: number;
  /**
   * The ground the whole composition sits on. Defaults to the app's own; a
   * caller putting this behind a page can pass a page token instead, so the
   * slab takes the ground colour of whatever theme is on rather than staying
   * the app's near-black in both.
   */
  background?: string;
}) {
  const frame = useCurrentFrame();
  const grid = CARDS;
  const shown = cards === undefined ? grid : grid.slice(0, Math.max(1, cards));
  const cardWidth =
    shown.length === grid.length
      ? CARD_W
      : Math.round((HOME_CONTENT - GRID_GAP * (shown.length - 1)) / shown.length);

  // Content is fully painted every frame. The plate scrolls the crop; this
  // composition only still needs `frame` for the live consensus + countdown.
  return (
    <AbsoluteFill style={{ background, fontFamily: FONT, letterSpacing: '-0.01em' }}>
      <Navbar />

      <div style={{ padding: `${PAGE_TOP}px ${HOME_PAD}px 0` }}>
        <div style={{ display: 'flex', gap: HERO_GAP, height: HERO_H }}>
          <NewsRail items={NEWS} />
          <div
            style={{
              width: HERO_RIGHT,
              display: 'flex',
              flexDirection: 'column',
              gap: STAGE_TO_TRENDING,
            }}
          >
            <SeriesStage frame={frame} />
            <TrendingRail />
          </div>
        </div>

        <div style={{ marginTop: HERO_TO_TOOLBAR }}>
          <Toolbar />
        </div>

        {/* The grid runs past the bottom edge — the plate crops it there. */}
        <div style={{ display: 'flex', gap: GRID_GAP, marginTop: TOOLBAR_TO_GRID }}>
          {shown.map((data) => (
            <InsightCard key={data.title} data={data} width={cardWidth} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}
