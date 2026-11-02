/**
 * The figures the page's mock screens show.
 *
 * None of this is copy and none of it is live: the app window in the middle
 * of the page and the three step cards under it are drawings of the product
 * with sample markets on them, and the numbers are the ones those drawings
 * were made with. They stay out of the copy catalogue for that reason — they
 * are not sentences anyone wrote for this page.
 */

export const APP = {
  brand: { sols: 'sols', market: 'market' },
  search: 'Search markets',
  nav: ['Markets', 'Portfolio', 'Activity'] as const,
  connect: 'Connect wallet',
  series: {
    live: 'Live series · Central bank',
    question: 'Will the Fed cut rates at the next meeting?',
    meta: 'Resolves in 3d 14h · $4.8M volume',
    yes: 'Yes 62¢',
    no: 'No 38¢',
    pct: '62%',
    chance: 'chance',
    ranges: ['1H', '1D', '1W', '1M', 'All'] as const,
    activeRange: 2,
  },
  trending: {
    label: 'Trending',
    items: [
      { q: 'SOL above $300 by Dec 31?', p: '41%' },
      { q: 'Best Picture goes to the favorite?', p: '58%' },
      { q: 'League leader takes the title?', p: '66%' },
      { q: 'Next flagship phone folds?', p: '22%' },
      { q: 'Inflation under 2.5% in Q1?', p: '57%' },
    ],
  },
  tabs: ['All', 'Crypto', 'Politics', 'Sports', 'Culture', 'Tech', 'Economy'] as const,
  sort: 'Sort: Volume ▾',
  cards: [
    { desk: 'Crypto', orchid: false, q: 'Bitcoin above $150k on Jan 1?', pct: 34, volume: '$1.2M volume' },
    {
      desk: 'Politics',
      orchid: true,
      q: 'Will turnout top 70% in the general election?',
      pct: 47,
      volume: '$860K volume',
    },
    { desk: 'Tech', orchid: false, q: 'A new model tops the leaderboard this month?', pct: 71, volume: '$540K volume' },
    {
      desk: 'Culture',
      orchid: true,
      q: 'Opening weekend over $150M at the box office?',
      pct: 29,
      volume: '$310K volume',
    },
  ],
  yes: 'Yes',
  no: 'No',
} as const;

/**
 * The series chart's line: a seeded random walk that settles towards the
 * quoted price over its last stretch. Seeded so the server and the client
 * draw the same path.
 */
export function chartPath(): { line: string; area: string } {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const n = 64;
  const points: [number, number][] = [];
  let y = 104;
  for (let i = 0; i < n; i++) {
    y += (rnd() - 0.56) * 9;
    y = Math.min(128, Math.max(22, y));
    if (i > n - 12) y += (52 - y) * 0.12;
    points.push([(i / (n - 1)) * 520, y]);
  }
  const line = points
    .map(([x, py], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${py.toFixed(1)}`)
    .join('');
  return { line, area: `${line}L520 150L0 150Z` };
}

export const MOCKS = {
  connect: {
    title: 'Connect wallet',
    google: 'Continue with Google',
    email: 'Sign in with email',
    wallets: 'Browser wallets',
    phantom: 'Phantom',
    detected: 'Detected',
  },
  order: {
    question: 'Will the Fed cut rates at the next meeting?',
    yes: 'Yes 62¢',
    no: 'No 38¢',
    rows: [
      { label: 'Amount', value: '$25.00', tone: 'plain' },
      { label: 'Shares', value: '40.32', tone: 'plain' },
      { label: 'Payout if Yes', value: '$40.32', tone: 'hl' },
    ] as const,
    cta: 'Buy Yes',
  },
  resolved: {
    badge: 'Resolved',
    won: 'Yes won',
    payout: '$40.32',
    unit: 'USDC',
    rows: [
      { label: 'Position', value: '40.32 Yes shares', tone: 'plain' },
      { label: 'Status', value: 'In your wallet', tone: 'ok' },
    ] as const,
  },
} as const;

/** The six desks, each with its own wash and picture. */
export const DESKS = [
  { key: 'crypto', base: '#1E69F6', image: '/v3/desk-crypto.webp' },
  { key: 'politics', base: '#7a5cf2', image: '/v3/desk-politics.webp' },
  { key: 'sports', base: '#3f8bff', image: '/v3/desk-sports.webp' },
  { key: 'culture', base: '#DC74EC', image: '/v3/desk-culture.webp' },
  { key: 'tech', base: '#4f62ff', image: '/v3/desk-tech.webp' },
  { key: 'economy', base: '#ad62e8', image: '/v3/desk-economy.webp' },
] as const;
