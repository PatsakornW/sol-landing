/**
 * The news feed, proxied.
 *
 * A Cloudflare Pages Function rather than a Next route handler: the site
 * itself is a static export with no server, and this is the one thing on it
 * that has to reach out at request time. Pages runs the files under
 * `functions/` as Workers beside the static build, so `/api/news-feed` keeps
 * working without dragging a Node runtime along for the whole site.
 *
 * Same-origin on purpose. The upstream sets no CORS headers a browser would
 * accept from this origin, and routing through here also means the origin can
 * move without a client rebuild.
 */
const DEFAULT_ORIGIN = 'https://sols-market-news-api.up.railway.app';
const MAX_LIMIT = 24;

interface Env {
  NEWS_API_PROXY_TARGET?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = (env.NEWS_API_PROXY_TARGET ?? DEFAULT_ORIGIN).replace(/\/+$/, '');
  const limitParam = new URL(request.url).searchParams.get('limit');
  const parsed = Number.parseInt(limitParam ?? '24', 10);
  const limit = Number.isFinite(parsed) ? Math.min(MAX_LIMIT, Math.max(1, parsed)) : 24;

  const upstream = await fetch(`${origin}/v1/feed?limit=${limit}`, {
    headers: { Accept: 'application/json' },
    cf: { cacheTtl: 120, cacheEverything: true },
  });

  if (!upstream.ok) {
    return Response.json({ items: [] }, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=120',
    },
  });
};
