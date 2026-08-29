/**
 * The two designs this site carries.
 *
 * Each is a separate document — its own faces, palette, corner scale, chrome
 * and copy — under its own root layout, so moving between them is a full page
 * load rather than a class on the shell. The corner toggle on each one steps to
 * the other and wraps.
 *
 * The paths carry a trailing slash because the site is exported as files:
 * Cloudflare serves `/v3` from `v3/index.html`, and a link written without the
 * slash costs a redirect on every click.
 */
export const REVISIONS = [
  { key: 'stage', label: 'V2', path: '/' },
  { key: 'parallax', label: 'V3', path: '/v3/' },
] as const;

export type RevisionKey = (typeof REVISIONS)[number]['key'];

/** Where the toggle goes from here, wrapping round. */
export function nextRevisionPath(current: RevisionKey): string {
  const index = REVISIONS.findIndex((revision) => revision.key === current);
  const next = REVISIONS[(index + 1) % REVISIONS.length];
  return next?.path ?? '/';
}
