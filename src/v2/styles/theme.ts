import * as stylex from '@stylexjs/stylex';
import { shape } from '../../styles/shape.stylex';
import { color, font } from '../../styles/tokens.stylex';

/**
 * Revision 6 — revision 5's material, on a shorter page.
 *
 * One moving shot fixed behind the whole document, and every block of copy
 * floating over it on frosted glass. Nothing here is opaque except the type:
 * the panels let the ground through, the chrome is a capsule rather than a bar,
 * and the page is read as a sequence of full screens over one continuous
 * backdrop.
 */

/** One sans, tight, in three weights. The shot supplies the personality. */
export const v2Type = stylex.createTheme(font, {
  display: 'var(--font-inter), Inter, "Helvetica Neue", ui-sans-serif, system-ui, sans-serif',
  sans: 'var(--font-inter), Inter, "Helvetica Neue", ui-sans-serif, system-ui, sans-serif',
});

/** The kit's cards and inputs pick the glass scale up from here. */
export const v2Shape = stylex.createTheme(shape, {
  bgRadius: '28px',
  mergedRadius: '20px',
  focusRingRadius: '32px',
});

/**
 * Night. The same glass over the same shot with the light behind it turned
 * down; the blue lifts to `#7ea6ff` because `#1b4dd8` clears this ground at
 * 2.1:1, under the line for the small caps the page sets it in.
 */
export const v2Dark = stylex.createTheme(color, {
  background: '#07090d',
  fg: '#eef1f6',
  card: '#12161d',
  muted: '#0d1116',
  mutedFg: 'rgba(238, 241, 246, 0.62)',
  accentFill: 'rgba(126, 166, 255, 0.16)',
  border: 'rgba(238, 241, 246, 0.14)',
  hover: 'rgba(238, 241, 246, 0.07)',
  active: 'rgba(238, 241, 246, 0.12)',
  primary: '#2b62f0',
  primaryFg: '#04060a',
  ring: '#7ea6ff',
  surface1: '#04060a',
  surface2: '#0d1116',
  surface3: '#07090d',
  surface4: '#12161d',
  landingPrimary: '#7ea6ff',
  landingPrimarySoft: 'rgba(126, 166, 255, 0.14)',
  accentOrange: '#7ea6ff',
  accentOrangeHover: '#9dbcff',
  accentOrangeActive: '#5d8cf5',
  accentOrangeDepth: '#132a63',
  accentOrangeInk: '#04060a',
  pressFace: '#1b4dd8',
  pressFaceHover: '#2b62f0',
  pressFaceActive: '#153eb0',
  pressDepth: '#132a63',
  pressLightFace: '#12161d',
  pressLightFaceHover: '#181d26',
  pressLightFaceActive: '#07090d',
  pressLightDepth: '#2b313c',
});
