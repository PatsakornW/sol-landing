import { useEffect, type RefObject } from 'react';

/** Below this much lost height, the change is browser chrome, not a keyboard. */
const KEYBOARD_MIN = 120;

/**
 * Scrolls the panel that holds `field` (its nearest scrolling ancestor inside
 * `root`) so the field sits mid-panel. Done by hand, not with scrollIntoView,
 * which on iOS also drags the locked page underneath.
 */
function centreIn(field: HTMLElement, root: HTMLElement) {
  for (let box = field.parentElement; box && root.contains(box); box = box.parentElement) {
    const { overflowY } = getComputedStyle(box);
    if ((overflowY === 'auto' || overflowY === 'scroll') && box.scrollHeight > box.clientHeight) {
      const f = field.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      box.scrollTop += f.top - b.top - (b.height - f.height) / 2;
      return;
    }
  }
}

/**
 * Keeps a fixed, full-screen overlay inside the part of the screen the
 * on-screen keyboard leaves visible.
 *
 * Phones open the keyboard over the *visual* viewport only: the layout
 * viewport, which `position: fixed` and every viewport unit (svh/dvh
 * included) are measured against, keeps its full height, so the lower half of
 * a centred or bottom sheet ends up under the keys. While `active`, this
 * publishes the visible area on the element as `--vv-top` and `--vv-height`
 * for its sheet to size itself with, sets `data-kb` while a keyboard is up,
 * and brings the focused field back into view whenever the area changes.
 *
 * Desktop, or a phone with no keyboard up, publishes the full window, so the
 * sheet looks exactly as it did.
 */
export function useKeyboardAvoid(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    const vv = typeof window === 'undefined' ? null : window.visualViewport;
    if (!active || !el || !vv) return;

    let frame = 0;
    let lastHeight = -1;
    const apply = () => {
      frame = 0;
      const height = vv.height;
      el.style.setProperty('--vv-top', `${vv.offsetTop}px`);
      el.style.setProperty('--vv-height', `${height}px`);
      el.toggleAttribute('data-kb', window.innerHeight - height > KEYBOARD_MIN);

      // The keyboard has just come up or gone: the field being typed in may
      // now sit outside the smaller area, so scroll its panel to it.
      if (height !== lastHeight) {
        lastHeight = height;
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && el.contains(focused) && focused.matches('input, textarea, select')) {
          centreIn(focused, el);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    vv.addEventListener('resize', schedule);
    vv.addEventListener('scroll', schedule);
    el.addEventListener('focusin', schedule);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener('resize', schedule);
      vv.removeEventListener('scroll', schedule);
      el.removeEventListener('focusin', schedule);
      el.style.removeProperty('--vv-top');
      el.style.removeProperty('--vv-height');
      el.removeAttribute('data-kb');
    };
  }, [ref, active]);
}
