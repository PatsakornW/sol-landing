// Single source of truth for site-wide, non-translated data (brand, links,
// contact, socials). Read across pages and components.

export const AppConfig = {
  name: 'SolsMarket',
  // The landing site's own canonical origin (metadata / sitemap / hreflang).
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solsmarket.xyz').replace(/\/$/, ''),
  // The main trading app that nav / CTAs deep-link into.
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  // VitePress docs host (separate from the landing App Router).
  docsUrl: (process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.solsmarket.xyz').replace(/\/$/, ''),

  email: 'hello@solsmarket.xyz',
  social: {
    x: { label: '@solsmarket', url: 'https://x.com/' },
    discord: { label: 'Discord', url: 'https://discord.com/' },
    instagram: { label: '@solsmarket', url: 'https://instagram.com/' },
  },
} as const;
