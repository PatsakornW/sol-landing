'use client';

import { Thumbnail } from '@remotion/player';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentType } from 'react';

/**
 * The plate shell both replicas render into: an outer frame that owns the crop
 * boundary, and an inner screen holding the composition at its real size.
 *
 * Everything Remotion touches lives behind this module and the two plate modules
 * that use it, all reached through lazy imports — a static import anywhere in the
 * page tree would pull `remotion` into the page bundle even on phones, where no
 * plate is ever rendered.
 *
 * The two callers differ only in styles, composition and crop geometry, so those
 * are the props; the `Thumbnail` wiring is not written twice.
 */

/**
 * Stays an inline style rather than a StyleX one, deliberately.
 *
 * `Thumbnail` composes this into the inline style of a wrapper it owns. A class
 * would be competing with that inline style and lose, and the plate would render
 * at the composition's intrinsic size instead of filling its frame — the one
 * place on this site where a style object is the correct interface.
 *
 * Transparent so cream print stock on the mechanism plates shows through any
 * cell the composition does not paint.
 */
const THUMBNAIL_STYLE = {
  width: '100%',
  height: '100%',
  background: 'transparent',
} as const;

export interface ClipPlateProps<P extends Record<string, unknown> = Record<string, never>> {
  /** The Remotion composition to render one frame of. Clips read their own
   *  frame through `useCurrentFrame`; anything else they need arrives as
   *  `inputProps`. */
  component: ComponentType<P>;
  /**
   * Handed to the composition by Remotion. The showcase uses it for the live
   * news rail — data the clip cannot fetch for itself, since it is re-rendered
   * per frame and must stay a pure function of its inputs.
   */
  inputProps?: P;
  /** Driven by the section, so the timing hook stays out of this lazy chunk. */
  frame: number;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
  /**
   * Outer frame — owns the aspect ratio, background and falloff. The same style
   * object the plate's `PlateSkeleton` renders, so the placeholder and the clip
   * reserve one box.
   */
  frameStyle: StyleXStyles;
  /** Inner screen — owns the crop (offset or scale) applied to the composition. */
  screenStyle: StyleXStyles;
}

export function ClipPlate<P extends Record<string, unknown> = Record<string, never>>({
  component,
  inputProps,
  frame,
  durationInFrames,
  fps,
  compositionWidth,
  compositionHeight,
  frameStyle,
  screenStyle,
}: ClipPlateProps<P>) {
  return (
    <div {...stylex.props(frameStyle)}>
      <div {...stylex.props(screenStyle)}>
        <Thumbnail
          component={component}
          inputProps={inputProps ?? ({} as P)}
          frameToDisplay={frame}
          durationInFrames={durationInFrames}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          fps={fps}
          style={THUMBNAIL_STYLE}
          overflowVisible={false}
          // A composition that throws must not take the page down with it: the
          // plate is decoration, and an empty frame is the correct fallback.
          errorFallback={() => <span />}
        />
      </div>
    </div>
  );
}
