/**
 * The designs this site carries.
 *
 * Each is a separate document — its own faces, palette, corner scale, chrome
 * and copy — under its own root layout, so moving between them is a full page
 * load rather than a class on the shell. The corner switch on every page
 * (`components/landing/VersionSwitch.tsx`) lists them all, and the sitemap
 * reads the same list.
 *
 * The paths carry a trailing slash because the site is exported as files:
 * GitHub Pages serves `/v2` from `v2/index.html`, and a link written without
 * the slash costs a redirect on every click.
 */
export const REVISIONS = [
  { key: 'stage', label: 'V1', path: '/' },
  { key: 'parallax', label: 'V2', path: '/v2/' },
  { key: 'eclipse', label: 'V3', path: '/v3/' },
  { key: 'v4', label: 'V4', path: '/v4/' },
  { key: 'v5', label: 'V5', path: '/v5/' },
  { key: 'v6', label: 'V6', path: '/v6/' },
  { key: 'v7', label: 'V7', path: '/v7/' },
  { key: 'v8', label: 'V8', path: '/v8/' },
  { key: 'v9', label: 'V9', path: '/v9/' },
] as const;

export type RevisionKey = (typeof REVISIONS)[number]['key'];
