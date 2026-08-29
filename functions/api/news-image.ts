import { isBlockedHost, isSafeExternalUrl } from '../../src/lib/safe-url';

/**
 * A same-origin image, so the dither canvas can read its pixels.
 *
 * A canvas cannot read back a cross-origin bitmap, and the plates on this site
 * are drawn by reading one. So every remote image comes through here, which
 * also means the guard on where "here" is allowed to fetch from lives in one
 * place — see `safe-url`, shared with the page that builds these URLs.
 *
 * Redirects are followed by hand rather than by the runtime: each hop has to
 * pass the same guard, or an allowed host could bounce the request anywhere.
 */
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_HOPS = 3;
const TIMEOUT_MS = 8000;

function blocked(url: URL): boolean {
  return !isSafeExternalUrl(url.href) || isBlockedHost(url.hostname);
}

async function fetchImage(url: URL, hops: number, signal: AbortSignal): Promise<Response> {
  if (hops > MAX_HOPS || blocked(url)) {
    throw new Error('blocked');
  }

  const response = await fetch(url, {
    signal,
    redirect: 'manual',
    headers: { Accept: 'image/*' },
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (!location) throw new Error('redirect');
    return fetchImage(new URL(location, url), hops + 1, signal);
  }

  return response;
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const src = new URL(request.url).searchParams.get('src');
  if (!src) return new Response('missing src', { status: 400 });

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new Response('bad src', { status: 400 });
  }
  if (blocked(target)) return new Response('blocked', { status: 400 });

  try {
    const upstream = await fetchImage(target, 0, AbortSignal.timeout(TIMEOUT_MS));
    if (!upstream.ok || !upstream.body) {
      return new Response('upstream', { status: 502 });
    }

    const type = upstream.headers.get('content-type') ?? '';
    if (!type.startsWith('image/')) {
      return new Response('not an image', { status: 415 });
    }

    const length = Number.parseInt(upstream.headers.get('content-length') ?? '', 10);
    if (Number.isFinite(length) && length > MAX_BYTES) {
      return new Response('too large', { status: 413 });
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch {
    return new Response('fetch failed', { status: 502 });
  }
};
