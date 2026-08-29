import * as stylex from '@stylexjs/stylex';

/**
 * Landing design tokens. `defineVars` must live in a `*.stylex.ts` file so the
 * compiler can hash the CSS custom properties and rewrite every reference.
 *
 * `--font-*` names stay literal: `next/font` publishes those on `<html>`.
 */
export const color = stylex.defineVars({
  background: '#0a0a0b',
  fg: '#18181b',
  card: '#ffffff',
  muted: '#f4f5f7',
  mutedFg: '#6b6b74',
  accentFill: '#f2f6ff',
  border: 'rgba(24, 24, 27, 0.14)',
  hover: '#eef1f6',
  active: '#e4e8f0',
  primary: '#1e69f6',
  primaryFg: '#ffffff',
  ring: '#2078ff',
  destructive: '#e05a5a',
  destructiveLight: '#fdecec',
  success: '#2b7fff',

  surface1: '#0a0a0b',
  surface2: '#e6e8ed',
  surface3: '#f2f3f6',
  surface4: '#ffffff',

  boardGround: '#0a0a0b',
  boardPlate: '#191918',
  /* A step above `boardPlate`, for panels that frame a product shot. The clips
     paint `--app-bg` (#1c1c1c), which sits 1.03:1 from `boardPlate` — the same
     colour, to the eye. Nothing drawn on top of that edge can rescue it: a dark
     drop shadow cast onto an equally dark ground has nothing to darken. At
     #2b2b2a the panel reads 1.20:1 against the shot and 1.40:1 against the
     section ground, so the shot sits *in* something. */
  boardPlateRaised: '#2b2b2a',
  /* Cream print stock. One value, two surfaces: the hero's article plates
     (`PrintCard`) and the mechanism steps' clip plates are the same paper, and
     they used to spell it as `#F2EDE2` in TypeScript and `#f2ede2` in CSS. */
  paper: '#f2ede2',
  paperInk: '#161412',
  boardInk: '#f6f6f3',
  boardInkDim: 'rgba(246, 246, 243, 0.58)',
  boardInkFaint: 'rgba(246, 246, 243, 0.42)',
  boardHairline: 'rgba(255, 255, 255, 0.1)',

  landingPrimary: '#2078ff',
  landingPrimarySoft: '#f3f7ff',
  accentOrange: '#ff6b2b',
  accentOrangeHover: '#ff8550',
  accentOrangeActive: '#e55a1b',
  accentOrangeDepth: '#6b2400',
  accentOrangeInk: '#3d1500',

  pressFace: '#2f7bff',
  pressFaceHover: '#4590ff',
  pressFaceActive: '#1a5fe0',
  pressDepth: '#02153d',
  pressLightFace: '#ffffff',
  pressLightFaceHover: '#f7f9fc',
  pressLightFaceActive: '#e8ebf1',
  pressLightDepth: '#5a6272',
  pressAccessFace: '#ffffff',
  pressAccessFaceHover: '#f3f7ff',
  pressAccessFaceActive: '#e4edff',
  pressAccessDepth: '#0a2f7a',

  appBg: '#1c1c1c',
  appSurface: '#262626',
  appMcSurface: '#282828',
  appMcBorder: '#333333',
  appBorder: '#2e2e2e',
  appText: '#e5e5e5',
  appTextSecondary: '#a1a1a1',
  appTextMuted: '#858585',
  appYes: '#3dbb78',
  appNo: '#e05a5a',
  appAccent: '#2078ff',
});

/* Two registers: ultra-condensed gothic caps for headlines, a monospaced
   neo-grotesque for everything else. `sans` (Inter) carries the UI labels and
   stands behind both display faces in the stacks below, which is why it is
   still listed inside `mono`. */
export const font = stylex.defineVars({
  sans: 'var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-anton), Anton, Impact, "Bebas Neue", sans-serif',
  mono: 'var(--font-geist-mono), "Geist Mono", var(--font-inter), ui-monospace, monospace',
});

export const shadow = stylex.defineVars({
  surface2: '0 0 0 1px rgb(24 24 27 / 0.09), 0 1px 1px -0.5px rgb(24 24 27 / 0.09)',
  surface3:
    '0 0 0 1px rgb(24 24 27 / 0.09), 0 1px 1px -0.5px rgb(24 24 27 / 0.09), 0 3px 3px -1.5px rgb(24 24 27 / 0.09)',
  surface5:
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.16), 0 1px 1px -0.5px rgba(0, 0, 0, 0.24), 0 3px 3px -1.5px rgba(0, 0, 0, 0.24), 0 6px 6px -3px rgba(0, 0, 0, 0.24), 0 12px 12px -6px rgba(0, 0, 0, 0.24)',
  darkPlate: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
  press: '0 5px 0 0 #02153d',
});

export const space = stylex.defineVars({
  pageInline: {
    default: 'max(16px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
    '@media (min-width: 720px)':
      'max(18px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
    '@media (min-width: 900px)':
      'max(44px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
  },
  sectionBlock: {
    default: '40px',
    '@media (min-width: 720px)': '48px',
    '@media (min-width: 900px)': '88px',
  },
  waitlistSlot: '49px',
  waitlistSlotStacked: '103px',
});
