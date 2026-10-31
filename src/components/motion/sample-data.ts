/**
 * The sample data every replica of the product shares.
 *
 * `MechanismFlows` and `HomeFlow` both quote the same figures, and they used to
 * re-type them as literals. Nothing enforced the two agreeing, so the mechanism
 * steps and the home showcase were one edit away from describing different
 * products. They should differ in what they show, never in what it says, so the
 * figures live here and both clips read them.
 *
 * Copy here is deliberately English in both locales: this is a picture of an app
 * surface, and the app surface is English. Only the sections framing these
 * replicas is localised (`locales/{en,th}/landing.json`).
 *
 * Markets are real-world events (policy, culture, politics, sports) — not coin
 * prices — so the preview reads as a general prediction surface.
 *
 * Brand thumbs use slugs from `@thesvg/react` (https://github.com/GLINCKER/thesvg)
 * when a square official mark exists. Full-bleed covers stay abstract artwork —
 * thesvg is brand logos, not editorial photography.
 */

import { asset } from '@/configs/configs';

/** Truncated pubkey, the way the app's wallet pill renders one. */
export const WALLET = '7xKf…9Qd2';

/** `WalletConnectModal`'s first row, and its settled state. */
export const CONNECT = {
  provider: 'Phantom',
  kind: 'Browser wallet',
  status: 'Connected',
} as const;

/**
 * Where `OutcomeFlow`'s book settles, and what `RedeemFlow` pays out. The clip
 * drifts the price up to `yesPct` and freezes there, so the twin showing the
 * same number is the twin showing the clip's last frame.
 */
export const TRADE = {
  question: 'Will the Fed cut rates at the next FOMC meeting?',
  closesIn: 'Closes in 3d 14h',
  yesPct: 62,
  noPct: 38,
  cta: 'Buy Yes',
} as const;

export const REDEEM = {
  badge: 'Resolved',
  label: 'Your payout',
  amount: '$40.32',
} as const;

/**
 * Official `@thesvg/react` slugs used as market thumbs. Only square marks that
 * read at 32–48px — wide wordmarks (Reuters, The Economist) are skipped.
 */
export type ShowcaseBrand =
  | 'goldman-sachs'
  | 'imdb'
  | 'espn'
  | 'fifa'
  | 'new-york-times'
  | 'cnn'
  | 'bbc';

/**
 * The live discovery-stage window. Labels are threshold/consensus rather than
 * coin prices so the stage matches a real-world event market.
 */
export const SERIES = {
  question: 'Will the next CPI print come in below 2.5%?',
  windowLabel: 'Live window',
  thresholdLabel: 'Threshold',
  threshold: '2.50%',
  currentLabel: 'Consensus',
  /** Base consensus value the stage drifts around (percent points). */
  currentBase: 2.42,
  currentDrift: 0.18,
  settleHint: 'Settles automatically at the window close',
  cta: 'Trade the window →',
  brand: 'goldman-sachs' as ShowcaseBrand,
} as const;

export type GridCard =
  | {
      kind: 'binary';
      brand: ShowcaseBrand;
      title: string;
      pct: number;
      vol: string;
      left: string;
    }
  | {
      kind: 'multi';
      brand: ShowcaseBrand;
      title: string;
      rows: ReadonlyArray<{ name: string; pct: number }>;
      vol: string;
      left: string;
    }
  /* `cardVariant: headline` (`.insight-card--headline`) — the cover fills the
     whole shell and the masthead replaces the header/body/footer stack. */
  | { kind: 'headline'; cover: string; kicker: string; title: string; pct: number };

/**
 * The event-group grid, in the order `HomeFlow` lays it out left to right.
 *
 * The binary card leads — it is the one that shows the trading affordance, the
 * Yes/No pair — and the cover card follows it. That keeps the photograph, which
 * is the card the news feed writes into, inside the compact plate's zoomed
 * slice: the slice reads in from the left edge and holds about a card and a
 * half.
 */
export const CARDS: readonly GridCard[] = [
  {
    kind: 'binary',
    brand: 'goldman-sachs',
    title: 'Will the Fed cut rates at the next FOMC meeting?',
    pct: 62,
    vol: '$128.4K',
    left: '12d 4h',
  },
  {
    kind: 'headline',
    cover: asset('/showcase/cover-politics.png'),
    kicker: 'Politics',
    title: 'Will turnout exceed 60% in the next general election?',
    pct: 64,
  },
  {
    kind: 'multi',
    brand: 'imdb',
    title: 'Who wins Best Picture at the Oscars?',
    rows: [
      { name: 'Leading contender', pct: 41 },
      { name: 'Runner-up', pct: 33 },
      { name: 'Dark horse', pct: 18 },
    ],
    vol: '$86.2K',
    left: '5d 11h',
  },
  {
    kind: 'multi',
    brand: 'espn',
    title: 'Which nation tops the Olympic gold medal table?',
    rows: [
      { name: 'United States', pct: 52 },
      { name: 'China', pct: 39 },
      { name: 'Great Britain', pct: 6 },
    ],
    vol: '$44.1K',
    left: '8d 2h',
  },
];

/** Discovery news rail — civic and sports, not token news. */
export const NEWS = [
  {
    cover: asset('/showcase/cover-news-civic.png'),
    kicker: 'Politics',
    title: 'Early voting totals revise turnout models higher',
    meta: '2h ago',
  },
  {
    cover: asset('/showcase/cover-news-sports.png'),
    kicker: 'Sports',
    title: 'Championship final set after stoppage-time equalizer',
    meta: '5h ago',
  },
] as const;

/** Ranked trending rail. `brand: null` keeps the letter-fallback path live. */
export const TRENDING = [
  {
    brand: 'goldman-sachs' as ShowcaseBrand,
    name: 'Fed cuts rates at the next FOMC',
    pct: 64,
    vol: '$212.6K',
  },
  { brand: null, name: 'Turnout exceeds 60% next election', pct: 38, vol: '$96.3K' },
  {
    brand: 'imdb' as ShowcaseBrand,
    name: 'Best Picture favorite holds the lead',
    pct: 71,
    vol: '$74.9K',
  },
] as const;
