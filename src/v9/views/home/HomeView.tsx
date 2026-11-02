'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BOOK_FLY, EVENTS_FLY, Fly, icon3d, PRICE_FLY } from '../../components/Fly';
import { Header } from '../../components/Header';
import { ArrowDown, ArrowRight } from '../../components/Icons';
import { JoinDialog } from '../../components/JoinDialog';
import { Sheet, type SheetKey } from '../../components/Sheet';
import { Smooth } from '../../components/Smooth';
import { Swap } from '../../components/Swap';
import { t9 } from '../../i18n/messages';
import { gsap, ScrollTrigger } from '../../lib/motion';

/** The coins drifting round the hero: where each sits, how big, and how fast it leaves on scroll. */
const HERO_COINS = [
  { icon: 'usdc', left: 70, top: -4, size: 16, speed: 1.4, rot: 20 },
  { icon: 'sol', left: 4, top: 12, size: 9, speed: 1, rot: -25 },
  { icon: 'yes', left: 94, top: 40, size: 9, speed: 1.1, rot: 15 },
  { icon: 'gold', left: -3, top: 84, size: 12, speed: 1.1, rot: -15 },
  { icon: 'no', left: 50, top: 82, size: 8, speed: 1.2, rot: 25 },
  { icon: 'btc', left: 30, top: 58, size: 5, speed: 1.6, rot: -30 },
];

/** Each scene's colour — the colour of its lettering on the dark ground — and the darker shade under its pills. */
const TONES = {
  pink: ['#DC74EC', '#8A1FA3'],
  blue: ['#3B7DFF', '#0B3AA6'],
  violet: ['#9B7BFF', '#4523B2'],
} as const;

/** How long the stage stays pinned, in screens of scroll. */
const SCREENS = 5.6;

/**
 * Revision 9 — the zoom, carrying the sols_market landing page's words.
 *
 * One pinned stage scrubbed by the scroll, in four scenes on V6's dark: the
 * hero's line in a chunky poster face among drifting 3D coins zooms past the
 * screen; then each statement grows from a speck to fill the screen and on
 * through it while market cards and 3D pieces fly out of the middle, the
 * lettering turning pink, blue, violet and pink again. In each line one word
 * flips now and then into a pill that opens a sheet. The stage lets go into the
 * closing call with its two pills. On every load the header drops in, the
 * hero's line lands with a bounce, and the coins pop in one after another.
 */
export function HomeView() {
  const stage = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState<SheetKey | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  useEffect(() => {
    const el = stage.current;
    if (!el || !document.documentElement.classList.contains('is-motion')) return;
    const q = gsap.utils.selector(el);
    const vw = (n: number) => () => window.innerWidth * n;
    const vh = (n: number) => () => window.innerHeight * n;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      const html = document.documentElement;
      gsap.set(q('.scene:not(.s1) .big'), { autoAlpha: 0 });

      /* A scene's line: in from a speck to full size, then on through the screen. */
      const line = (sel: string, inAt: number, outAt: number) => {
        tl.fromTo(q(sel), { scale: 0.28, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, inAt);
        tl.to(q(sel), { scale: 5, duration: 0.7, ease: 'power2.in' }, outAt);
        tl.to(q(sel), { autoAlpha: 0, duration: 0.2 }, outAt + 0.5);
      };
      /* A scene's flight: every piece out of the middle, through its spot and past the edge. */
      const fly = (scene: string, at: number, span = 1.2) => {
        q(`${scene} .fly__item`).forEach((item) => {
          const x = Number(item.dataset.x);
          const y = Number(item.dataset.y);
          const rot = Number(item.dataset.rot);
          const t = at + Number(item.dataset.at) * span;
          tl.fromTo(
            item,
            { x: 0, y: 0, scale: 0.05, rotation: 0, autoAlpha: 0 },
            { x: vw(x / 2), y: vh(y / 2), scale: 1, rotation: rot, autoAlpha: 1, duration: 0.7, ease: 'power1.out' },
            t,
          );
          tl.to(item, { x: vw(x * 1.1), y: vh(y * 1.1), scale: 2.4, rotation: rot * 2, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, t + 0.7);
        });
      };
      const tone = (name: keyof typeof TONES, at: number) =>
        tl.to(html, { '--tone': TONES[name][0], '--tone-deep': TONES[name][1], duration: 0.4 }, at);

      /* 0 — the hero's line zooms past; the coins drift up and away. */
      tl.to(q('.s1 .big'), { scale: 4.5, duration: 0.75, ease: 'power2.in' }, 0.05);
      tl.to(q('.s1 .big'), { autoAlpha: 0, duration: 0.2 }, 0.6);
      q('.coin').forEach((coin) => {
        const speed = Number(coin.dataset.speed);
        tl.to(coin, { y: vh(-1.4 * speed), rotation: `+=${Number(coin.dataset.rot) * 3}`, duration: 1.4 }, 0);
      });
      tl.to(q('.s1__mascot'), { y: vh(0.45), duration: 0.7 }, 0);
      // From an explicit start: when the timeline is built the cue is still mid load-in, at 0.
      tl.fromTo(q('.s1__cue'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 0);

      /* 0.55 — every question has a price; the cards fly out; to blue. */
      line('.s2 .big', 0.55, 1.45);
      fly('.s2', 1.2);
      tone('blue', 1.9);

      /* 2.2 — the order book; more flies out; to violet. */
      line('.s3 .big', 2.2, 3.0);
      fly('.s3', 2.7, 1);
      tone('violet', 3.3);

      /* 3.5 — the desks' pieces fly out first, then the line comes in; to pink. */
      fly('.s4', 3.4, 1);
      tl.fromTo(q('.s4 .big'), { scale: 0.28, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 4.2);
      tone('pink', 4.6);
      tl.set({}, {}, SCREENS);

      ScrollTrigger.create({ trigger: el, start: 'top top', end: `+=${SCREENS * 100}%`, pin: true, scrub: 0.6, animation: tl, invalidateOnRefresh: true });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="v9" id="top">
      <Smooth />
      <Header onSheet={setSheet} onJoin={openJoin} />
      <main>
        <div className="stage" ref={stage}>
          <section className="scene s1" aria-labelledby="v9-hero">
            <div className="coins" aria-hidden="true">
              {HERO_COINS.map((c, i) => (
                <span
                  key={i}
                  className="coin"
                  data-speed={c.speed}
                  data-rot={c.rot}
                  style={{ left: `${c.left}%`, top: `${c.top}%`, ['--size' as string]: `${c.size}vmax`, ['--r' as string]: `${c.rot}deg`, ['--d' as string]: `${i * -0.7}s`, ['--i' as string]: i }}
                >
                  <img src={icon3d(c.icon)} alt="" />
                </span>
              ))}
            </div>
            <h1 className="big big--hero" id="v9-hero">
              <span className="big__top">{t9('hero.top')}</span>
              <span className="big__word">{t9('hero.word')}</span>
            </h1>
            <span className="s1__mascot" aria-hidden="true">
              <img src={icon3d('sun')} alt="" />
            </span>
            <span className="s1__cue" aria-hidden="true">
              <ArrowDown />
            </span>
          </section>

          <section className="scene s2" aria-label={t9('nav.links.how')}>
            <Fly items={PRICE_FLY} />
            <h2 className="big">
              <span>{t9('price.a')}</span> <span>{t9('price.b')}</span>{' '}
              <Swap word={t9('price.word')} pill={t9('price.pill')} tone="blue" onPill={() => setSheet('how')} />
            </h2>
          </section>

          <section className="scene s3" aria-label={t9('nav.links.platform')}>
            <Fly items={BOOK_FLY} />
            <h2 className="big">
              <span>{t9('book.a')}</span> <span>{t9('book.b')}</span>{' '}
              <Swap word={t9('book.word')} pill={t9('book.pill')} tone="pink" onPill={() => setSheet('platform')} />
            </h2>
          </section>

          <section className="scene s4" aria-label={t9('nav.links.markets')}>
            <Fly items={EVENTS_FLY} className="fly--big" />
            <h2 className="big">
              <span>{t9('events.a')}</span> <span>{t9('events.b')}</span>{' '}
              <Swap word={t9('events.word')} pill={t9('events.pill')} tone="cream" onPill={() => setSheet('markets')} />
            </h2>
          </section>
        </div>

        <section className="notify" aria-labelledby="v9-notify">
          <div className="notify__call">
            <img className="notify__mascot" src={icon3d('vault')} alt="" aria-hidden="true" />
            <h2 className="big notify__title" id="v9-notify">
              <span>{t9('notify.a')}</span>
              <span>{t9('notify.b')}</span>
            </h2>
          </div>
          <div className="notify__pills">
            <button type="button" className="pill pill--big" onClick={openJoin} aria-haspopup="dialog">
              {t9('notify.join')}
              <ArrowRight />
            </button>
            <button type="button" className="pill pill--big" onClick={() => setSheet('faq')} aria-haspopup="dialog">
              {t9('notify.faq')}
              <ArrowRight />
            </button>
            <span className="notify__shadow" aria-hidden="true" />
          </div>
        </section>
      </main>
      <Sheet open={sheet} onClose={closeSheet} onJoin={openJoin} />
      <JoinDialog open={joinOpen} onClose={closeJoin} />
    </div>
  );
}
