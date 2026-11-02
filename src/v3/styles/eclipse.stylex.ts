import * as stylex from '@stylexjs/stylex';

/**
 * Revision 3's own palette and measures.
 *
 * The page is lit by one event — a blue orb passing in front of a striped
 * purple one, with a white-hot corona where they overlap — and every colour
 * below is a part of that picture: the void behind it, the two orbs, the
 * corona, the star-coloured type. `defineConsts`, so the compiler inlines each
 * value where it is used; nothing here changes at runtime.
 */
export const V3 = stylex.defineConsts({
  void: '#030309',
  void2: '#0a0a1d',
  orchid: '#DC74EC',
  cobalt: '#1E69F6',
  corona: '#FFE3B3',
  star: '#EFEDFA',
  dust: '#9b98ba',
  faint: '#5f5c7e',
  line: 'rgba(239, 237, 250, 0.11)',
  line2: 'rgba(239, 237, 250, 0.22)',
  /** The sun-coloured button face and the ink that sits on it. */
  sun: '#FFF6E6',
  ink: '#07071a',
  gutter: 'clamp(16px, 4vw, 56px)',
  max: '1320px',
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  pill: '999px',
});

/** The breakpoints this design was drawn at. */
export const bp = stylex.defineConsts({
  max520: '@media (max-width: 520px)',
  max600: '@media (max-width: 600px)',
  max720: '@media (max-width: 720px)',
  min721: '@media (min-width: 721px)',
  max760: '@media (max-width: 760px)',
  max900: '@media (max-width: 900px)',
  max1180: '@media (max-width: 1180px)',
});
