import { useId } from 'react';

/**
 * The name and the mark, in one place. A rename is a change to these two
 * lines; nothing else on the page spells the name.
 */
export const BRAND = 'SolsMarket';

export const PINK = '#DC74EC';
export const BLUE = '#1E69F6';

/**
 * The mark: two equal circles, the left one in pink horizontal stripes, the
 * right one solid blue and drawn on top. Each instance gets its own pattern id.
 */
export function BrandMark({ className }: { className?: string }) {
  const id = `v4-stripes-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox="0 0 50 34" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="50" height="6.5" y="0.5">
          <rect width="50" height="4" fill={PINK} />
        </pattern>
      </defs>
      <circle cx="17" cy="17" r="17" fill={`url(#${id})`} />
      <circle cx="33" cy="17" r="17" fill={BLUE} />
    </svg>
  );
}

/** The mark as an SVG data URL, for the favicon. */
export const MARK_DATA_URL = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 34"><defs><pattern id="s" patternUnits="userSpaceOnUse" width="50" height="6.5" y="0.5"><rect width="50" height="4" fill="${PINK}"/></pattern></defs><circle cx="17" cy="17" r="17" fill="url(#s)"/><circle cx="33" cy="17" r="17" fill="${BLUE}"/></svg>`,
)}`;
