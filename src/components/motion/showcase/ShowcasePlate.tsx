'use client';

import { ClipPlate } from '@/components/motion/ClipPlate';
import { HomeFlow } from './HomeFlow';
import { showcaseCrop, showcasePlate } from './showcase-plate.styles';
import {
  COMPACT_CROP_TOP,
  COMPACT_ZOOM,
  CROP_TOP,
  HOME_DURATION,
  HOME_FPS,
  HOME_HEIGHT,
  HOME_WIDTH,
  SCROLL_END,
  SCROLL_START,
} from './home-timing.stylex';

/**
 * Reached through a lazy import in `MarketPreview` for the same reason
 * `MechanismPlate` is: a static import would pull `remotion` into the page bundle
 * even on phones, where the plate is never rendered.
 *
 * The plate is a fixed-height window onto the full home composition. On appear it
 * scrolls that window from the top of the route (nav + discovery) down to the
 * markets band (trending + toolbar + cards), then holds. Crop geometry stays in
 * `home-timing.stylex.ts` and is handed to CSS as custom properties.
 */

export interface ShowcasePlateProps {
  /** Driven by the section, so the timing hook stays out of the lazy chunk. */
  frame: number;
  /**
   * Phone-width stage: show a zoomed portrait slice of the canvas rather than
   * its whole width, which at this size would be too small to read. Same clip,
   * same scroll — only the window onto it changes.
   */
  compact: boolean;
  /** Latched by the section on scroll — drives the frame's one entrance. */
  revealed: boolean;
}

/** Smoothstep — ease in and out without pulling Remotion into this math. */
function easeInOut(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Scroll progress 0 (top of app) → 1 (settled markets band). */
function scrollProgress(frame: number): number {
  if (frame <= SCROLL_START) return 0;
  if (frame >= SCROLL_END) return 1;
  return easeInOut((frame - SCROLL_START) / (SCROLL_END - SCROLL_START));
}

export default function ShowcasePlate({
  frame,
  compact,
  revealed,
}: ShowcasePlateProps) {
  // Composition-pixel offset of the crop: 0 shows the navbar, the settled value
  // lands on the markets band. Each regime settles where its own frame runs out
  // of composition, so neither ends on empty ground.
  const settled = compact ? COMPACT_CROP_TOP : CROP_TOP;

  return (
    <ClipPlate
      component={HomeFlow}
      inputProps={{}}
      frame={frame}
      durationInFrames={HOME_DURATION}
      fps={HOME_FPS}
      compositionWidth={HOME_WIDTH}
      compositionHeight={HOME_HEIGHT}
      frameStyle={[
        showcasePlate.frame,
        compact && showcasePlate.compactFrame,
        showcasePlate.enter,
        revealed && showcasePlate.revealed,
      ]}
      // The pan is a fraction of the composition height, not a pixel offset —
      // see `showcaseCrop`. Recomputed every frame, which is exactly what a
      // dynamic style is for: the value lands as an inline custom property and
      // the rule that reads it is compiled once.
      screenStyle={[
        showcasePlate.screen,
        showcaseCrop.pan(
          compact ? COMPACT_ZOOM : 1,
          scrollProgress(frame) * (settled / HOME_HEIGHT),
        ),
      ]}
    />
  );
}
