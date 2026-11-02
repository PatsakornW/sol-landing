import { useId } from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

/* The mark's own two hues. Not tokens: they are the logo, not the palette. */
const ORB_BACK = '#DC74EC';
const ORB_FRONT = '#1E69F6';
const GAP_YS = [18, 25, 32, 39, 46] as const;

/**
 * The SolsMarket mark, sized by its caller.
 *
 * `BrandMark` in the shared kit takes a pixel size; this page sets the mark in
 * fluid measures — a `clamp()` in the marquee, a `width: 100%` in a flex
 * cell — so this one takes a style instead and leaves the box to CSS. The
 * drawing is the same two orbs.
 */
export function Orbs({ style }: { style?: StyleXStyles }) {
  const uid = useId().replace(/:/g, '');
  const maskId = `v3-orb-mask-${uid}`;

  return (
    <svg viewBox="0 0 64 64" {...stylex.props(style)} aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <circle cx="23" cy="32" r="19" fill="#fff" />
          {GAP_YS.map((y) => (
            <rect key={y} x="4" y={y} width="38" height="2.25" fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="23" cy="32" r="19" fill={ORB_BACK} mask={`url(#${maskId})`} />
      <circle cx="41" cy="32" r="19" fill={ORB_FRONT} />
    </svg>
  );
}
