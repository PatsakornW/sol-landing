// Single source of truth for site-wide, non-translated data (brand, links,
// contact, socials). Read across pages and components.

/**
 * The path the site is served under. Empty at the root of a domain; on GitHub
 * Pages a project site lives under `/<repo>`, and `next.config.ts` reads the
 * same variable so every route and bundle URL carries it.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/**
 * A file under `public/`, prefixed for the base path. `<Link>` and the router
 * add it on their own; plain `<img src>` and metadata URLs do not.
 */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

export const AppConfig = {
  name: 'SolsMarket',
  // The landing site's own canonical origin (metadata / sitemap / hreflang).
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://solsmarket.xyz').replace(/\/$/, ''),
  // The main trading app that nav / CTAs deep-link into.
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, ''),
  // VitePress docs host (separate from the landing App Router).
  docsUrl: (process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.solsmarket.xyz').replace(/\/$/, ''),

  email: 'hello@solsmarket.xyz',
  social: {
    x: { label: '@solsmarket', url: 'https://x.com/' },
    discord: { label: 'Discord', url: 'https://discord.com/' },
    instagram: { label: '@solsmarket', url: 'https://instagram.com/' },
  },
} as const;
