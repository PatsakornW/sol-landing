'use client';

import { useEffect, useState } from 'react';
import { prefetchImage } from '@/components/landing/StippleCanvas';
import type { ShowcaseNewsItem } from '@/components/motion/showcase/HomeFlow';
import {
  fetchHeroNews,
  msUntilNextUtcDay,
  newsImageSrc,
  previewWindow,
  RAIL_SLOTS,
  utcDayIndex,
} from '@/lib/news';

/**
 * The rail's meta line. English, like the rest of the copy inside the plate —
 * that text is the app's own UI, and only the section around it is localised.
 */
function relativeAge(iso: string, now: number): string {
  const at = Date.parse(iso);
  if (!Number.isFinite(at)) return '';
  const minutes = Math.max(0, Math.round((now - at) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * Today's slice of the news feed, shaped for the rows inside the home clip.
 *
 * Four surfaces frame this clip — the shipped preview band and the V3, V4 and
 * V7 revisions — and all of them need the same day cursor, the same offset past
 * the hero's plates and the same decoder warm-up. The framing is what differs
 * between them, so only the framing is written more than once.
 */
export function useShowcaseNews(): {
  news?: readonly ShowcaseNewsItem[];
  headline?: ShowcaseNewsItem;
} {
  const [day, setDay] = useState<number | null>(null);
  const [news, setNews] = useState<readonly ShowcaseNewsItem[] | undefined>(undefined);
  const [headline, setHeadline] = useState<ShowcaseNewsItem | undefined>(undefined);

  // The UTC day is read after mount, never during render: a clock read in a
  // render pass is a blocking prerender access — the reason the hero reaches
  // for it through `HeroBoardGate`. These plates are client-only regardless.
  useEffect(() => setDay(utcDayIndex()), []);

  // Same feed and same day cursor as the hero's print plates, offset past them
  // by `HERO_SLOTS` so the rail never shows a photograph the hero is already
  // printing — see `previewWindow`. The timer re-arms the rotation for anyone
  // still on the page when the UTC day turns over.
  useEffect(() => {
    if (day === null) return undefined;
    const ac = new AbortController();
    const timer = window.setTimeout(() => setDay(utcDayIndex()), msUntilNextUtcDay());

    fetchHeroNews(ac.signal)
      .then((pool) => {
        if (ac.signal.aborted) return;
        const now = Date.now();
        const rows = previewWindow(pool, day).map((item) => ({
          cover: newsImageSrc(item.imageUrl),
          kicker: item.category || 'News',
          title: item.headline,
          meta: relativeAge(item.publishedAt, now),
        }));
        // Warm the decoder before the pan reaches them: an undecoded cover
        // shows as an empty card mid-scroll.
        for (const row of rows) prefetchImage(row.cover);
        // The window is ordered rail-first, then the grid's headline card.
        const rail = rows.slice(0, RAIL_SLOTS);
        if (rail.length > 0) setNews(rail);
        setHeadline(rows[RAIL_SLOTS]);
      })
      .catch(() => {
        /* The composition's sample rows stand. */
      });

    return () => {
      ac.abort();
      window.clearTimeout(timer);
    };
  }, [day]);

  return { news, headline };
}
