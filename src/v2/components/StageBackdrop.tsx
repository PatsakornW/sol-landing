'use client';

import dynamic from 'next/dynamic';

/**
 * The opening shot's backdrop: the app itself, held still behind the title.
 *
 * The stage used to run the shipped hero's print plates back here. Those are
 * an illustration of the product's subject; this is the product. It arrives
 * blurred and dimmed to well under the headline, on the page's own ground
 * rather than the app's near-black slab, and held on a late frame — nothing
 * about it moves, so the first screen is an image with words on it rather than
 * a video playing behind them.
 *
 * Client-only, and deliberately without a placeholder: the composition renders
 * through Remotion, which is not a server pass, and a backdrop that is missing
 * for a moment is a backdrop nobody noticed was missing. A skeleton here would
 * be a grey slab appearing and then leaving.
 */
const StageBackdropClip = dynamic(() => import('./StageBackdropClip'), {
  ssr: false,
  loading: () => null,
});

export function StageBackdrop() {
  return <StageBackdropClip />;
}
