import { paintPrice, PRICE } from '../components/Scenes';

/*
 * The scroll-scrubbed plays inside the scenes, shared by the two layouts: the
 * stage places them on its one long timeline, the stack gives each its own
 * timeline on a pinned section. Each adds its tweens to `tl` from `at` and
 * returns where it ends.
 */

type Timeline = gsap.core.Timeline;
type Select = (selector: string) => HTMLElement[];

/** A share of the screen height, read when the timeline (re)measures. */
export const vh = (n: number) => () => (window.innerHeight * n) / 100;

/** The price card counting a Yes share up from 0 to its price. */
export function playPrice(tl: Timeline, root: HTMLElement, at: number, duration = 2): number {
  const price = { v: 0 };
  tl.fromTo(price, { v: 0 }, { v: PRICE, duration, ease: 'power1.inOut', onUpdate: () => paintPrice(root, price.v) }, at);
  return at + duration;
}

/**
 * The order flow: the wire draws, a Yes order and a No order meet in the
 * book and match, a pulse runs to Solana and the batch lands on the stack.
 * `down` is the stacked layout, where the wire runs vertically.
 */
export function playFlow(tl: Timeline, q: Select, at: number, down = false): number {
  const dx = down ? 90 : 150;
  tl.fromTo(q('.flow__wire'), down ? { scaleY: 0 } : { scaleX: 0 }, down ? { scaleY: 1, duration: 0.8 } : { scaleX: 1, duration: 0.8 }, at);
  tl.fromTo(q('.flow__chip--bid'), { autoAlpha: 0, x: -dx }, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power2.out' }, at + 0.4);
  tl.fromTo(q('.flow__chip--ask'), { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power2.out' }, at + 0.6);
  tl.to(q('.flow__chip'), { autoAlpha: 0, scale: 0.7, duration: 0.4 }, at + 1.9);
  tl.fromTo(q('.flow__match'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, at + 2);
  const along = down ? 'top' : 'left';
  tl.fromTo(q('.flow__pulse'), { [along]: '0%', autoAlpha: 0 }, { [along]: '100%', autoAlpha: 1, duration: 1.4 }, at + 2.5);
  tl.to(q('.flow__pulse'), { autoAlpha: 0, duration: 0.2 }, at + 3.8);
  tl.fromTo(q('.flow__block:not(.flow__block--new)'), { y: -50 }, { y: 0, duration: 0.6, ease: 'power2.out' }, at + 3.7);
  tl.fromTo(q('.flow__block--new'), { autoAlpha: 0, y: -50, scale: 1.08 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, at + 3.7);
  tl.fromTo(q('.flow__block--new .flow__done'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.5 }, at + 4.4);
  return at + 4.9;
}

const tilt = (_: number, el: HTMLElement) => parseFloat(getComputedStyle(el).getPropertyValue('--tilt')) || 0;

/**
 * The three desk cards rising together, already fanning out as they come.
 * `rise` is how far below they start, in hundredths of the screen height.
 */
export function playFan(tl: Timeline, q: Select, at: number, duration = 1.2, rise = 75): number {
  tl.fromTo(
    q('.markets .card'),
    { y: vh(rise), rotation: (i: number, el: HTMLElement) => tilt(i, el) * 0.4 },
    { y: 0, rotation: tilt, duration, ease: 'power2.out' },
    at,
  );
  return at + duration;
}

/**
 * The questions as a stack: each card rises over the last, and only once it
 * is most of the way up do the ones beneath shrink, lift and darken — so the
 * card being read stays bright until it is covered. The fourth one down
 * fades out.
 */
export function playStack(tl: Timeline, q: Select, at: number, step = 1.25): number {
  const cards = q('.qs__tile');
  cards.forEach((card, i) => {
    const t = at + i * step;
    if (i > 0) tl.fromTo(card, { y: vh(95), rotation: i % 2 ? 3 : -3 }, { y: 0, rotation: 0, duration: step * 0.8, ease: 'power2.out' }, t);
    for (let j = 0; j < i; j++) {
      const depth = i - j;
      tl.to(
        cards[j]!,
        {
          scale: 1 - 0.05 * depth,
          // Three levels of this is the --stack-lift the sheet keeps clear above .qs__tiles.
          y: -18 * depth,
          filter: `brightness(${1 - 0.15 * depth})`,
          autoAlpha: depth > 3 ? 0 : 1,
          duration: step * 0.45,
          ease: 'power2.out',
        },
        t + step * 0.4,
      );
    }
  });
  return at + (cards.length - 1) * step + step * 0.8;
}
