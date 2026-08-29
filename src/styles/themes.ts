import * as stylex from '@stylexjs/stylex';
import { color } from './tokens.stylex';

/** Dark plates rebind the token set so children inherit board ink and fills. */
export const onDark = stylex.createTheme(color, {
  background: '#0a0a0b',
  fg: '#ffffff',
  card: '#1f1f1f',
  muted: '#181818',
  mutedFg: 'rgba(255, 255, 255, 0.62)',
  accentFill: 'rgba(30, 105, 246, 0.22)',
  border: 'rgba(255, 255, 255, 0.12)',
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.1)',
  surface1: '#111111',
  surface2: '#181818',
  surface3: '#1f1f1f',
  surface4: '#262626',
  landingPrimary: '#6aa6ff',
  landingPrimarySoft: 'rgba(106, 166, 255, 0.18)',
  // The press button's shelf is a lit edge, not a cast shadow: on a light page
  // the base `#02153d` reads as depth because the ground is brighter than it,
  // but on `surface1` it measures 1.06:1 and the button loses its third
  // dimension entirely. Rebound to a mid navy that clears the dark ground at
  // 2.4:1 while still sitting 2.0:1 below the face, so the step survives from
  // both sides. Scoped to the theme because `StatusPage` uses the same tokens
  // on the light base and needs the darker shelf there.
  pressDepth: '#234f9f',
});
