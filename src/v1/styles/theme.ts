import * as stylex from '@stylexjs/stylex';
import { shape } from '../../styles/shape.stylex';
import { color, font } from '../../styles/tokens.stylex';

/**
 * Revision 6 — the same product, staged.
 *
 * One idea per screen, type at poster size, and almost no chrome. The palette
 * is deliberately narrow: a ground, its ink, and the blue. Anything else on
 * screen at that scale becomes decoration the reader has to look past.
 */

/** One face, very large and very tight. */
export const v1Type = stylex.createTheme(font, {
  display: 'var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif',
  sans: 'var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif',
});

/** Soft but not round — the stage frames a clip, it does not pillow it. */
export const v1Shape = stylex.createTheme(shape, {
  bgRadius: '20px',
  mergedRadius: '16px',
  focusRingRadius: '24px',
});

/**
 * Night: the stage as a cinema. Near-black ground, paper-white type, and the
 * blue lifted to `#7fa9ff` — `#1d4ed8` clears this ground at 1.9:1, far under
 * the line for type set this large and this thin.
 */
export const v1Dark = stylex.createTheme(color, {
  background: '#08090c',
  fg: '#f5f7fb',
  card: '#101319',
  muted: '#0c0e13',
  mutedFg: 'rgba(245, 247, 251, 0.6)',
  accentFill: 'rgba(127, 169, 255, 0.14)',
  border: 'rgba(245, 247, 251, 0.12)',
  hover: 'rgba(245, 247, 251, 0.06)',
  active: 'rgba(245, 247, 251, 0.1)',
  primary: '#2f63ee',
  primaryFg: '#04050a',
  ring: '#7fa9ff',
  surface1: '#04050a',
  surface2: '#0c0e13',
  surface3: '#08090c',
  surface4: '#101319',
  landingPrimary: '#7fa9ff',
  landingPrimarySoft: 'rgba(127, 169, 255, 0.12)',
  accentOrange: '#7fa9ff',
  accentOrangeHover: '#a0c1ff',
  accentOrangeActive: '#5f92f5',
  accentOrangeDepth: '#132a5e',
  accentOrangeInk: '#04050a',
  pressFace: '#1d4ed8',
  pressFaceHover: '#2f63ee',
  pressFaceActive: '#1740b4',
  pressDepth: '#132a5e',
  pressLightFace: '#101319',
  pressLightFaceHover: '#161a22',
  pressLightFaceActive: '#08090c',
  pressLightDepth: '#2b303b',
});
