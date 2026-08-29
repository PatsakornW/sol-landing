import * as stylex from '@stylexjs/stylex';

/**
 * The site's at-rules, declared once.
 *
 * These used to be a block of local `const MD = '@media (min-width: 900px)'`
 * lines at the top of every component that needed one — eight copies of the same
 * six strings, with nothing to catch a breakpoint moved in one file and not the
 * others. `defineConsts` is the StyleX answer: values are inlined at compile
 * time, so a condition key can be `media.md` and still be the static string the
 * compiler requires.
 *
 * Unlike `defineVars`, nothing here reaches the browser as a custom property —
 * a const is substituted into the rule itself, which is what lets it be used as
 * an at-rule key rather than a value.
 */
export const media = stylex.defineConsts({
  sm: '@media (min-width: 720px)',
  md: '@media (min-width: 900px)',
  lg: '@media (min-width: 1200px)',
  /** The laptop band: two columns, but not yet the room `lg` assumes. */
  mdLg: '@media (min-width: 900px) and (max-width: 1199px)',
  /** Small phones, where a two-up row stops fitting at all. */
  xs: '@media (max-width: 380px)',
  maxSm: '@media (max-width: 719px)',
  /**
   * The plate regime boundary. `PLATE_COMPACT_MAX_WIDTH` in `lib/remotion.ts` is
   * the same 899, read by `useCompactPlate()` — the two are paired on purpose:
   * components that know the regime pass it as a prop, and this query is the
   * fallback for the one render that cannot (the props-less `loading` closure
   * `next/dynamic` calls while a chunk downloads).
   */
  maxMd: '@media (max-width: 899px)',
  /** Short phone landscape: the hero has to fit a keyboardless 500px stage. */
  landscape: '@media (orientation: landscape) and (max-width: 899px) and (max-height: 500px)',
  /** Guards every hover affordance, so a touch device never latches one. */
  hover: '@media (hover: hover) and (pointer: fine)',
  reduce: '@media (prefers-reduced-motion: reduce)',
  /**
   * No JavaScript: the lazy clips will never arrive, so surfaces that a script
   * would have revealed show themselves and placeholders that would be lying
   * come out.
   */
  noScript: '@media (scripting: none)',
});

/** The site's one easing curve, so a transition never invents a second opinion. */
export const motion = stylex.defineConsts({
  ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
});
