import { isSafeExternalUrl } from '@/lib/safe-url';

export type HeroNewsItem = {
  headline: string;
  imageUrl: string;
  href: string;
  external: boolean;
  /** Feed `category`, e.g. `world`. Empty when the row carries none. */
  category: string;
  /** Feed `published_at`, ISO-8601. Empty when the row carries none. */
  publishedAt: string;
};

/** Fixed ink per plate, left to right: pink, green, blue. Green sits in the
 *  middle so the two stronger hues bookend the row. */
export const HERO_INKS = ['#C43A9A', '#1B8F78', '#2A62F0'] as const;

export const HERO_FALLBACK_IMAGES = [
  '/print/forecast.jpg',
  '/print/vault.jpg',
  '/print/book.jpg',
] as const;

const FEED_PATH = '/api/news-feed';

export function newsImageSrc(imageUrl: string): string {
  if (imageUrl.startsWith('/')) return imageUrl;
  return `/api/news-image?src=${encodeURIComponent(imageUrl)}`;
}

function asText(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/** Pull feed rows that have a usable photograph, newest first. */
export function pickHeroNews(payload: unknown, count = 3): HeroNewsItem[] {
  if (!payload || typeof payload !== 'object' || !('items' in payload)) return [];
  const rows = (payload as { items: unknown }).items;
  if (!Array.isArray(rows)) return [];

  const picked: HeroNewsItem[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const item = row as {
      headline?: unknown;
      image_url?: unknown;
      category?: unknown;
      published_at?: unknown;
      source?: { url?: unknown; image_url?: unknown } | null;
    };
    const headline = asText(item.headline);
    const imageUrl = asText(item.image_url) ?? asText(item.source?.image_url);
    if (!headline || !imageUrl || !isSafeExternalUrl(imageUrl) || seen.has(imageUrl)) {
      continue;
    }
    const href = asText(item.source?.url);
    const external = isSafeExternalUrl(href);
    seen.add(imageUrl);
    picked.push({
      headline,
      imageUrl,
      href: external && href ? href : '#preview',
      external,
      category: asText(item.category) ?? '',
      publishedAt: asText(item.published_at) ?? '',
    });
    if (picked.length >= count) break;
  }

  return picked;
}

/* ── Daily rotation ───────────────────────────────────────────────────────── */

/**
 * The feed is read by two surfaces — the hero's three print plates and the
 * preview plate's news rail — and both turn over on the same UTC day. The
 * cursor lives here rather than in either component so they cannot drift apart
 * or, worse, land on the same photograph: the hero takes the first
 * `HERO_SLOTS` of the day's window and the preview takes the `PREVIEW_SLOTS`
 * directly after them.
 *
 * `DAY_STRIDE` is therefore everything one day consumes. Advancing by the
 * stride rather than by the hero's own count is what keeps tomorrow's plates
 * off today's rail.
 */
export const HERO_SLOTS = 3;
/** Two cover cards in the plate's news rail, then one for the grid's headline
 *  card — `MarketPreview` splits the window in that order. */
export const RAIL_SLOTS = 2;
export const PREVIEW_SLOTS = RAIL_SLOTS + 1;
const DAY_STRIDE = HERO_SLOTS + PREVIEW_SLOTS;

const DAY_MS = 86_400_000;

export function utcDayIndex(): number {
  return Math.floor(Date.now() / DAY_MS);
}

export function msUntilNextUtcDay(): number {
  return DAY_MS - (Date.now() % DAY_MS);
}

/** Where the day's window opens in a pool of `length`. */
export function dayCursor(length: number, day: number): number {
  if (length === 0) return 0;
  return (day * DAY_STRIDE) % length;
}

/** `count` items from `start`, wrapping, never repeating inside one window. */
export function takeWindow(
  pool: readonly HeroNewsItem[],
  start: number,
  count: number,
): HeroNewsItem[] {
  const out: HeroNewsItem[] = [];
  if (pool.length === 0) return out;
  const origin = ((start % pool.length) + pool.length) % pool.length;
  const take = Math.min(count, pool.length);
  for (let i = 0; i < take; i++) {
    const item = pool[(origin + i) % pool.length];
    if (item) out.push(item);
  }
  return out;
}

/**
 * The rail's slice of the day — the items after the hero's. Falls back to
 * whatever the pool has when it is too small to hold both surfaces, which is
 * the only case where a photograph can appear twice on one screen.
 */
export function previewWindow(pool: readonly HeroNewsItem[], day: number): HeroNewsItem[] {
  return takeWindow(pool, dayCursor(pool.length, day) + HERO_SLOTS, PREVIEW_SLOTS);
}

export async function fetchHeroNews(signal?: AbortSignal): Promise<HeroNewsItem[]> {
  const response = await fetch(`${FEED_PATH}?limit=24`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`news feed ${response.status}`);
  return pickHeroNews(await response.json(), 24);
}
