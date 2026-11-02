import * as stylex from '@stylexjs/stylex';
import { shape } from '../../styles/shape.stylex';
import { color, font } from '../../styles/tokens.stylex';

/**
 * Revision 3 — the eclipse.
 *
 * A dark page lit from one place: a blue orb crossing a striped purple one in
 * the hero, drawn live in WebGL, and the same two orbs sized by the market
 * price further down. The type is one modern grotesk, Geist: tight and
 * heavy for everything that is said, a light weight for the turn in a
 * headline, and plain for everything that is explained.
 */

const GEIST = 'var(--font-geist), Geist, system-ui, -apple-system, "Segoe UI", sans-serif';

/** Geist for the display register and the text under it. No mono. */
export const v3Type = stylex.createTheme(font, {
  display: GEIST,
  sans: GEIST,
  mono: GEIST,
});

/** Big soft corners: every panel on this page is a rounded plate. */
export const v3Shape = stylex.createTheme(shape, {
  bgRadius: '24px',
  mergedRadius: '18px',
  focusRingRadius: '26px',
});

/**
 * Deep space. The shared kit — the status pages, the corner toggle — reads
 * these tokens; the page's own components take their colours straight from
 * `eclipse.stylex.ts`.
 */
export const v3Dark = stylex.createTheme(color, {
  background: '#030309',
  fg: '#EFEDFA',
  card: '#0a0a1d',
  muted: '#07071a',
  mutedFg: '#9b98ba',
  accentFill: 'rgba(30, 105, 246, 0.16)',
  border: 'rgba(239, 237, 250, 0.11)',
  hover: 'rgba(239, 237, 250, 0.07)',
  active: 'rgba(239, 237, 250, 0.12)',
  primary: '#1E69F6',
  primaryFg: '#ffffff',
  ring: '#FFE3B3',
  success: '#8de0b0',
  surface1: '#010104',
  surface2: '#0a0a1d',
  surface3: '#030309',
  surface4: '#0f0f2a',
  boardGround: '#030309',
  boardPlate: '#0a0a1d',
  boardPlateRaised: '#12122c',
  boardInk: '#EFEDFA',
  boardInkDim: 'rgba(239, 237, 250, 0.62)',
  boardInkFaint: 'rgba(239, 237, 250, 0.42)',
  boardHairline: 'rgba(239, 237, 250, 0.11)',
  landingPrimary: '#1E69F6',
  landingPrimarySoft: 'rgba(30, 105, 246, 0.14)',
  accentOrange: '#FFE3B3',
  accentOrangeHover: '#fff0d4',
  accentOrangeActive: '#f5d39a',
  accentOrangeDepth: '#6b4a1a',
  accentOrangeInk: '#07071a',
  pressFace: '#1E69F6',
  pressFaceHover: '#3b7dff',
  pressFaceActive: '#174fc4',
  pressDepth: '#0b2a6b',
  pressLightFace: '#0a0a1d',
  pressLightFaceHover: '#12122c',
  pressLightFaceActive: '#030309',
  pressLightDepth: '#2a2a4a',
  pressAccessFace: '#FFF6E6',
  pressAccessFaceHover: '#ffffff',
  pressAccessFaceActive: '#f5e6cc',
  pressAccessDepth: '#6b4a1a',
});
