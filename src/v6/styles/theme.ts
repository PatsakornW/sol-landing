import * as stylex from '@stylexjs/stylex';
import { shape } from '../../styles/shape.stylex';
import { color, font } from '../../styles/tokens.stylex';

/**
 * Revision 7 — the candy shelf.
 *
 * Three faces: a heavy rounded poster face for everything shouted, a condensed
 * grotesk set in capitals for everything said, and a tall condensed face for
 * the ribbon. All three come through `next/font`. The market cards alone are
 * set in Inter, the app's own face, because they are the app's own cards.
 */
const BARLOW = 'var(--font-barlow), "Barlow Condensed", "Arial Narrow", sans-serif';

export const v7Type = stylex.createTheme(font, {
  display: 'var(--font-changa), "Changa One", Impact, "Arial Black", sans-serif',
  sans: BARLOW,
  mono: BARLOW,
});

export const v7Shape = stylex.createTheme(shape, {
  bgRadius: '18px',
  mergedRadius: '12px',
  focusRingRadius: '20px',
});

/** V5's dark, for the shared kit (status pages, the corner switch). */
export const v7Dark = stylex.createTheme(color, {
  background: '#16171C',
  fg: '#EBEBEB',
  card: '#2F3038',
  muted: '#25262D',
  mutedFg: 'rgba(235, 235, 235, 0.68)',
  accentFill: 'rgba(30, 105, 246, 0.16)',
  border: 'rgba(255, 255, 255, 0.1)',
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.1)',
  primary: '#1E69F6',
  primaryFg: '#FFFFFF',
  ring: '#1E69F6',
  success: '#2FA36B',
  surface1: '#0F1013',
  surface2: '#25262D',
  surface3: '#16171C',
  surface4: '#2F3038',
  boardGround: '#16171C',
  boardPlate: '#25262D',
  boardPlateRaised: '#2F3038',
  boardInk: '#EBEBEB',
  boardInkDim: 'rgba(235, 235, 235, 0.68)',
  boardInkFaint: 'rgba(235, 235, 235, 0.45)',
  boardHairline: 'rgba(255, 255, 255, 0.1)',
  landingPrimary: '#1E69F6',
  landingPrimarySoft: 'rgba(30, 105, 246, 0.14)',
  pressFace: '#1E69F6',
  pressFaceHover: '#3B7DFF',
  pressFaceActive: '#174FC4',
  pressDepth: '#0B2A6B',
  pressLightFace: '#2F3038',
  pressLightFaceHover: '#3A3B44',
  pressLightFaceActive: '#25262D',
  pressLightDepth: '#0F1013',
});
