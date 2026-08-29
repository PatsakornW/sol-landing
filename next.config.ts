import type { NextConfig } from 'next';

/**
 * Built for Cloudflare Pages as a static site.
 *
 * Every page here is copy and prerendered clips — there is nothing to render
 * per request, so `output: 'export'` writes the whole site to `out/` and Pages
 * serves it from the edge with no runtime at all. The two upstream proxies the
 * news rail needs live in `functions/` instead, which Pages runs as Workers
 * beside the static files.
 */
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  // StyleX compiles through Babel (`babel.config.js`). The Turbopack-native
  // compiler path does not run that plugin, so the React Compiler rides along
  // with `next/babel` instead.
  reactCompiler: true,
  // No image optimizer on a static export; the clips draw their own bitmaps.
  images: { unoptimized: true },
  // Pages serves `/v3` from `v3/index.html`, so the links have to carry the
  // trailing slash the file layout implies.
  trailingSlash: true,
};

export default nextConfig;
