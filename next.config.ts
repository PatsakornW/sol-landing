import type { NextConfig } from 'next';

/**
 * Built for GitHub Pages as a static site.
 *
 * Every page here is copy and prerendered clips — there is nothing to render
 * per request, so `output: 'export'` writes the whole site to `out/` and Pages
 * serves the files as they are. A project site lives under `/<repo>`, which
 * `NEXT_PUBLIC_BASE_PATH` carries into every route, bundle and asset URL; leave
 * it unset for a custom domain or local work.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  reactStrictMode: true,
  // StyleX compiles through Babel (`babel.config.js`). The Turbopack-native
  // compiler path does not run that plugin, so the React Compiler rides along
  // with `next/babel` instead.
  reactCompiler: true,
  // No image optimizer on a static export; the clips draw their own bitmaps.
  images: { unoptimized: true },
  // Pages serves `/v2` from `v2/index.html`, so the links have to carry the
  // trailing slash the file layout implies.
  trailingSlash: true,
};

export default nextConfig;
