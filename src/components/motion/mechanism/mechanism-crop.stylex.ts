import * as stylex from '@stylexjs/stylex';

/**
 * The two things that differ per mechanism step, published as variables.
 *
 * They were arguments to a dynamic style, which is the obvious shape right up
 * until the fallback matters. `stylex.firstThatWorks` emits the same property
 * twice in descending support order; a dynamic style has exactly one declaration
 * per property to fill from an inline custom property, so the plugin cannot
 * compile the call and it survives into the bundle, where the runtime shim
 * throws `Unexpected 'stylex.firstThatWorks' call at runtime`.
 *
 * As variables the crop rule is static: both fallback declarations compile, once,
 * and only these two values ride in on the element. The defaults are step 0's,
 * so the plate still crops correctly if nothing sets them.
 */
export const cropVars = stylex.defineVars({
  /** Zoom floor for this step — a bare number, since it feeds `scale`. */
  floor: '1.14',
  /** The point the zoom holds still. */
  origin: '50% 50%',
});
