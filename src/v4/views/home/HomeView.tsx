'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/configs/configs';
import { Btn } from '../../components/Btn';
import { DeckDots, useDeck } from '../../components/Deck';
import { Footer } from '../../components/Footer';
import { Asterisk, DESK_GLYPHS, GLYPHS, PixelArrow } from '../../components/Icons';
import { JoinDialog } from '../../components/JoinDialog';
import { Nav, type LinkKey } from '../../components/Nav';
import { scrollToTarget, Smooth } from '../../components/Smooth';
import { t4, t4Words } from '../../i18n/messages';
import { startCoin } from '../../lib/coin';
import { gsap, reducedMotion } from '../../lib/motion';

const img = (name: string) => asset(`/v4/${name}.webp`);

/** Each step and the coins that roll in beside it. */
const STEPS = [
  { key: 'a', coins: ['c-sol', 'c-btc', 'c-yes'] },
  { key: 'b', coins: ['c-no', 'c-usdc', 'c-q'] },
  { key: 'c', coins: ['c-sol', 'c-btc', 'c-yes', 'c-no', 'c-usdc', 'c-q'] },
] as const;

const ROW = ['c-sol', 'c-btc', 'c-yes', 'c-no', 'c-usdc', 'c-q'];

/** The Yes / No market cards: a desk with one of V5's questions and an illustrative Yes chance. */
const MARKETS = [
  { desk: 'crypto', yes: 62 },
  { desk: 'politics', yes: 58 },
] as const;

/** The one multi-outcome market, with an illustrative chance per outcome. */
const FED = [
  { key: 'o1', chance: 18 },
  { key: 'o2', chance: 64 },
  { key: 'o3', chance: 18 },
] as const;

/* The live chart: an illustrative five minutes of the Up and the Down price, on a 640 × 560 frame. */
const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
const UP = path([
  [40, 300],
  [110, 280],
  [170, 295],
  [230, 250],
  [300, 262],
  [360, 220],
  [420, 232],
  [480, 190],
  [550, 200],
  [600, 170],
]);
const DOWN = path([
  [40, 320],
  [110, 340],
  [170, 325],
  [230, 370],
  [300, 358],
  [360, 400],
  [420, 388],
  [480, 430],
  [550, 420],
  [600, 450],
]);

/** How often the live section's headline moves to its next subject, in ms. */
const ROLL_MS = 1800;

const FEATURES = ['onchain', 'instant', 'noncustodial', 'oracle'] as const;
const FAQ = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

/* The platform grid: the feature cells and the button cell, then plain cells to
   fill the rest — some carrying a faint glyph — in the order a phone shows them. */
const CELLS: ({ kind: 'text'; key: (typeof FEATURES)[number] } | { kind: 'cta' } | { kind: 'cell'; glyph?: number; extra?: boolean })[] = [];
{
  const plain = (n: number, from: number, extra = false) => {
    for (let i = 0; i < n; i++) CELLS.push({ kind: 'cell', glyph: (from + i) % 3 === 0 ? (from + i) % GLYPHS.length : undefined, extra });
  };
  plain(4, 0);
  CELLS.push({ kind: 'text', key: 'onchain' });
  plain(4, 4);
  CELLS.push({ kind: 'text', key: 'instant' });
  plain(4, 8);
  CELLS.push({ kind: 'text', key: 'noncustodial' });
  plain(4, 12);
  CELLS.push({ kind: 'text', key: 'oracle' });
  plain(4, 16);
  CELLS.push({ kind: 'cta' });
  plain(10, 20, true);
}

/**
 * V4 — the black vault, carrying the sols_market landing page's words.
 *
 * A dark grid ground, a live 3D coin in matte black and chrome with grey
 * spheres and a pink spark round it, a heavy grotesk in a silver gradient, and
 * pink for everything that can be pressed. Then three steps on frosted cards
 * with coins rolling in, the chance in 3D, a deck of three live markets, a
 * five-minute market beside a headline that rolls through what has a price,
 * the platform on a grid of tiles, the risks on a stack
 * of windows, the questions, and a footer under a marquee of the name. On
 * every load the decor pops in, then the coin and the lines.
 */
export function HomeView() {
  const root = useRef<HTMLDivElement>(null);
  const coin = useRef<HTMLCanvasElement>(null);
  const steps = useDeck();
  const deck = useDeck();
  const [joinOpen, setJoinOpen] = useState(false);
  const [faq, setFaq] = useState<(typeof FAQ)[number]>('q1');
  const [word, setWord] = useState(0);
  const words = t4Words();

  // The live section's headline rolls through what has a price.
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % words.length), ROLL_MS);
    return () => window.clearInterval(id);
  }, [words.length]);

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const go = useCallback((key: LinkKey) => {
    if (key === 'main') scrollToTarget(0);
    else {
      const el = document.getElementById(`v4-${key}`);
      if (el) scrollToTarget(el);
    }
  }, []);

  // The hero coin, live.
  useEffect(() => {
    if (!coin.current) return;
    return startCoin(coin.current, reducedMotion()) ?? undefined;
  }, []);

  // Lines and blocks marked `.rv` rise in as they enter.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -12% 0px' },
    );
    el.querySelectorAll('.rv').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // The scroll's motion: drifting decor, coins rolling in, the chance pulling
  // into focus, the cards drifting over their heads, bars filling, lines drawing, tiles and windows coming in.
  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      q('[data-speed]').forEach((n) => {
        const speed = Number(n.dataset.speed);
        const section = n.closest('section') ?? n;
        gsap.fromTo(
          n,
          { y: () => speed * 120 },
          { y: () => speed * -120, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      // On a wide screen each deck's cards drift at their own speeds; the head behind them blurs as they pass.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        q('.deck').forEach((list) => {
          const section = list.closest('section');
          [...list.children].forEach((card, i) => {
            gsap.fromTo(
              card,
              { y: 120 + i * 90 },
              { y: -60 - i * 40, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } },
            );
          });
          // fromTo, so the start isn't read while the head's lines are still hidden.
          gsap.fromTo(
            section?.querySelector('.deck__head') ?? [],
            { filter: 'blur(0px)', opacity: 1 },
            { filter: 'blur(8px)', opacity: 0.3, ease: 'none', scrollTrigger: { trigger: list, start: 'top 45%', end: 'top 5%', scrub: true } },
          );
        });
      });

      q('.coins').forEach((row) => {
        gsap.from(row.children, {
          x: 90,
          rotation: 30,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        });
      });

      gsap.fromTo(
        q('.price__figure'),
        { scale: 0.7, autoAlpha: 0, filter: 'blur(16px)' },
        {
          scale: 1,
          autoAlpha: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: { trigger: q('.price')[0], start: 'top 80%', end: 'center 60%', scrub: true },
        },
      );

      // Each market's chance counts up as its bar fills.
      const deck = q('.markets .deck')[0];
      gsap.from(q('.mkt__fill'), {
        scaleX: 0,
        duration: 1.3,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: deck, start: 'top 80%' },
      });
      q('[data-count]').forEach((v) => {
        const to = Number(v.dataset.count);
        const n = { v: 0 };
        gsap.to(n, {
          v: to,
          duration: 1.4,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: deck, start: 'top 80%' },
          onUpdate: () => (v.textContent = `${Math.round(n.v)}%`),
        });
      });

      // The live chart's Up and Down lines draw in.
      q('.live__line').forEach((p) => {
        const len = (p as unknown as SVGPathElement).getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: q('.live')[0], start: 'top 70%' } },
        );
      });
      gsap.from(q('.live__area'), { autoAlpha: 0, duration: 1.2, delay: 0.8, scrollTrigger: { trigger: q('.live')[0], start: 'top 70%' } });

      gsap.from(q('.grid > *'), {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        stagger: { each: 0.02, from: 'random' },
        scrollTrigger: { trigger: q('.grid')[0], start: 'top 80%' },
      });

      gsap.from(q('.window'), {
        autoAlpha: 0,
        x: -60,
        y: -40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: q('.risk')[0], start: 'top 70%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="v4" ref={root}>
      <Smooth />
      <Nav onGo={go} onJoin={openJoin} />
      <main>
        <section className="hero" id="v4-main" aria-labelledby="v4-hero">
          <span className="pixels pixels--a" aria-hidden="true" data-speed="0.4" />
          <span className="pixels pixels--b" aria-hidden="true" data-speed="-0.3" />
          <span className="pixels pixels--c" aria-hidden="true" data-speed="0.6" />
          <div className="hero__coin" data-speed="-0.25">
            <img className="hero__still" src={img('coin')} alt="" />
            <canvas className="hero__live" ref={coin} aria-hidden="true" />
            <img className="deco hero__star" src={img('star')} alt="" />
            <img className="deco hero__star hero__star--b" src={img('star')} alt="" />
            <img className="deco hero__clip" src={img('capsule')} alt="" />
            <img className="deco hero__ball" src={img('sphere')} alt="" />
            <img className="deco hero__ball hero__ball--b" src={img('sphere')} alt="" />
          </div>
          <div className="hero__text">
            <p className="hero__kicker">{t4('hero.kicker')}</p>
            <h1 className="display hero__title" id="v4-hero">
              <span>{t4('hero.a')}</span> <span>{t4('hero.b')}</span>
            </h1>
          </div>
          <p className="hero__lead">{t4('hero.lead')}</p>
          <button type="button" className="hero__cta" onClick={openJoin} aria-haspopup="dialog">
            <PixelArrow />
            <span>{t4('hero.cta')}</span>
          </button>
          <Btn className="hero__cta-m" onClick={openJoin} dialog>
            {t4('hero.cta')}
          </Btn>
        </section>

        <section className="how" id="v4-how" aria-labelledby="v4-how-t">
          <div className="deck__head">
            <p className="eyebrow rv">{t4('how.eyebrow')}</p>
            <h2 className="display how__title rv" id="v4-how-t">
              {t4('how.title')}
            </h2>
          </div>
          <ol className="deck" ref={steps.ref} data-lenis-prevent-touch data-lenis-prevent-horizontal>
            {STEPS.map((s, i) => (
              <li key={s.key} className={`step step--${s.key}`}>
                <span className="step__n">
                  .0{i + 1}
                  <sup>{t4('how.step')}</sup>
                </span>
                <span className={`coins coins--${s.coins.length}`} aria-hidden="true">
                  {s.coins.map((c, j) => (
                    <img key={j} src={img(c)} alt="" />
                  ))}
                </span>
                <p className="step__text">{t4(`how.steps.${s.key}`)}</p>
              </li>
            ))}
          </ol>
          <DeckDots count={STEPS.length} slide={steps.slide} onPick={steps.toSlide} label={(i) => `.0${i + 1}`} />
        </section>

        <section className="price" aria-labelledby="v4-price-t">
          <img className="deco price__ball" src={img('sphere')} alt="" data-speed="0.5" />
          <img className="deco price__ball price__ball--b" src={img('sphere')} alt="" data-speed="-0.4" />
          <img className="deco price__ball price__ball--c" src={img('sphere')} alt="" data-speed="0.8" />
          <span className="pixels pixels--d" aria-hidden="true" data-speed="0.3" />
          <p className="price__before rv" id="v4-price-t">
            {t4('price.before')}
          </p>
          <div className="price__fig">
            <img className="price__figure" src={img('n62')} alt={t4('price.figure')} />
            <img className="deco price__star" src={img('star')} alt="" />
            <img className="deco price__clip" src={img('capsule')} alt="" />
            <img className="deco price__clip price__clip--b" src={img('capsule')} alt="" />
          </div>
          <p className="price__after rv">{t4('price.after')}</p>
          <Btn className="price__cta" onClick={() => go('faq')}>
            {t4('price.cta')}
          </Btn>
          <div className="note note--center rv">
            <Asterisk />
            <p className="note__title">{t4('price.noteTitle')}</p>
            <p>{t4('price.note')}</p>
          </div>
        </section>

        <section className="markets" id="v4-markets" aria-labelledby="v4-markets-t">
          {/* The head sticks only as far as the deck, so it never sits under the button below. */}
          <div className="markets__deck">
            <div className="deck__head">
              <p className="eyebrow rv">{t4('markets.eyebrow')}</p>
              <h2 className="display markets__title rv" id="v4-markets-t">
                {t4('markets.title')}
              </h2>
              <p className="markets__lead rv">{t4('markets.lead')}</p>
            </div>
            <ol className="deck" ref={deck.ref} data-lenis-prevent-touch data-lenis-prevent-horizontal>
              {MARKETS.map((m, i) => (
                <li key={m.desk} className={i === 0 ? 'mkt is-hot' : 'mkt'}>
                  <div className="mkt__top">
                    <span className="mkt__icon" aria-hidden="true">
                      {DESK_GLYPHS[m.desk]}
                    </span>
                    <span className="mkt__desk">{t4(`markets.names.${m.desk}`)}</span>
                    <span className="mkt__live">{t4('markets.live')}</span>
                  </div>
                  <h3 className="display mkt__q">{t4(`markets.q.${m.desk}`)}</h3>
                  <p className="mkt__chance">
                    <b data-count={m.yes}>{m.yes}%</b>
                    <span>{t4('markets.chance')}</span>
                  </p>
                  <span className="mkt__bar" aria-hidden="true">
                    <i className="mkt__fill" style={{ width: `${m.yes}%` }} />
                  </span>
                  <p className="mkt__buy">
                    <span className="mkt__yes">
                      {t4('markets.yes')} {m.yes}¢
                    </span>
                    <span className="mkt__no">
                      {t4('markets.no')} {100 - m.yes}¢
                    </span>
                  </p>
                </li>
              ))}
              <li className="mkt mkt--multi">
                <div className="mkt__top">
                  <span className="mkt__icon" aria-hidden="true">
                    {DESK_GLYPHS.economy}
                  </span>
                  <span className="mkt__desk">{t4('markets.names.economy')}</span>
                  <span className="mkt__live">{t4('markets.live')}</span>
                </div>
                <h3 className="display mkt__q">{t4('markets.q.economy')}</h3>
                <ul className="mkt__options">
                  {FED.map((o) => (
                    <li key={o.key}>
                      <span>{t4(`markets.fed.${o.key}`)}</span>
                      <b data-count={o.chance}>{o.chance}%</b>
                      <span className="mkt__bar" aria-hidden="true">
                        <i className="mkt__fill" style={{ width: `${o.chance}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            </ol>
          </div>
          <DeckDots count={MARKETS.length + 1} slide={deck.slide} onPick={deck.toSlide} label={(i) => `${i + 1}`} />
          <div className="markets__foot">
            <span className="coins coins--row" aria-hidden="true">
              {ROW.map((c) => (
                <img key={c} src={img(c)} alt="" />
              ))}
            </span>
            <Btn className="markets__cta" onClick={openJoin} dialog>
              {t4('markets.cta')}
            </Btn>
            <div className="note markets__note">
              <Asterisk />
              <p>{t4('markets.note')}</p>
            </div>
          </div>
        </section>

        <section className="live" id="v4-live" aria-labelledby="v4-live-t">
          <div className="live__chart" aria-hidden="true">
            <p className="live__q">{t4('live.question')}</p>
            <svg viewBox="0 0 640 560" preserveAspectRatio="none">
              <defs>
                <linearGradient id="v4-live-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#DC74EC" stopOpacity="0.34" />
                  <stop offset="1" stopColor="#DC74EC" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="live__grid"
                d="M40 140H600M40 250H600M40 360H600M40 470H600"
                stroke="#fff"
                strokeOpacity="0.08"
                strokeDasharray="4 8"
                fill="none"
              />
              <path className="live__area" d={`${UP}L600 560L40 560Z`} fill="url(#v4-live-fill)" />
              <path className="live__line" d={DOWN} stroke="#e8e8e8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path className="live__line" d={UP} stroke="#DC74EC" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="600" cy="170" r="7" fill="#DC74EC" />
              <circle cx="600" cy="450" r="6" fill="#e8e8e8" />
            </svg>
            <p className="live__tag live__tag--up">{t4('live.up')}</p>
            <p className="live__tag live__tag--down">{t4('live.down')}</p>
          </div>
          <div className="live__text">
            <p className="eyebrow rv">{t4('live.eyebrow')}</p>
            <h2 className="display live__title rv" id="v4-live-t">
              <span className="live__word" key={word}>
                {words[word]}
              </span>
              <span>{t4('live.suffix')}</span>
            </h2>
            <div className="note rv">
              <Asterisk />
              <p className="note__title">{t4('live.noteTitle')}</p>
              <p>{t4('live.note')}</p>
            </div>
            <Btn className="live__cta" onClick={openJoin} dialog>
              {t4('live.cta')}
            </Btn>
          </div>
        </section>

        <section className="platform" aria-labelledby="v4-platform-t">
          <img className="deco platform__piece" src={img('gavel')} alt="" data-speed="0.6" />
          <img className="deco platform__piece platform__piece--b" src={img('ballot')} alt="" data-speed="-0.5" />
          <img className="deco platform__piece platform__piece--c" src={img('gavel')} alt="" data-speed="0.9" />
          <div className="platform__head rv">
            <p className="eyebrow">{t4('platform.eyebrow')}</p>
            <h2 className="display platform__title" id="v4-platform-t">
              {t4('platform.title')}
            </h2>
          </div>
          <div className="grid">
            {CELLS.map((c, i) =>
              c.kind === 'text' ? (
                <div key={i} className={`grid__text grid__text--${c.key}`}>
                  <Asterisk />
                  <h3>{t4(`platform.items.${c.key}.title`)}</h3>
                  <p>{t4(`platform.items.${c.key}.desc`)}</p>
                </div>
              ) : c.kind === 'cta' ? (
                <button key={i} type="button" className="grid__cta" onClick={() => go('faq')}>
                  <PixelArrow />
                  {t4('platform.cta')}
                </button>
              ) : (
                <span key={i} className={c.extra ? 'grid__cell grid__cell--extra' : 'grid__cell'} aria-hidden="true">
                  {c.glyph !== undefined ? GLYPHS[c.glyph] : null}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="risk" aria-labelledby="v4-risk-t">
          <img className="deco risk__ball" src={img('sphere')} alt="" data-speed="0.4" />
          <img className="deco risk__ball risk__ball--b" src={img('sphere')} alt="" data-speed="-0.3" />
          <img className="deco risk__star" src={img('star')} alt="" data-speed="0.2" />
          <img className="deco risk__star risk__star--b" src={img('star')} alt="" data-speed="-0.2" />
          <div className="windows">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="window" style={{ ['--i' as string]: i }} aria-hidden="true">
                <span className="window__bar">×</span>
              </div>
            ))}
            <div className="window window--front" style={{ ['--i' as string]: 4 }}>
              <span className="window__bar" aria-hidden="true">
                ×
              </span>
              <img className="deco window__clip" src={img('capsule')} alt="" />
              <h2 className="display window__title" id="v4-risk-t">
                {t4('risk.title')}
              </h2>
              <p>{t4('risk.body')}</p>
              <button type="button" className="window__link" onClick={() => go('faq')}>
                {t4('risk.cta')}
              </button>
            </div>
          </div>
        </section>

        <section className="faq" id="v4-faq" aria-labelledby="v4-faq-t">
          <div className="faq__head rv">
            <p className="eyebrow">{t4('faq.eyebrow')}</p>
            <h2 className="display faq__title" id="v4-faq-t">
              {t4('faq.title')}
            </h2>
          </div>
          <div className="faq__body">
            <ul className="faq__list">
              {FAQ.map((k) => (
                <li key={k} className={k === faq ? 'is-on' : undefined}>
                  <button type="button" className="faq__q" aria-expanded={k === faq} onClick={() => setFaq(k)}>
                    {t4(`faq.items.${k}.q`)}
                  </button>
                  <p className="faq__a faq__a--inline">{t4(`faq.items.${k}.a`)}</p>
                </li>
              ))}
            </ul>
            <div className="faq__panel" aria-live="polite">
              <Asterisk />
              <p key={faq}>{t4(`faq.items.${faq}.a`)}</p>
              <p className="faq__lead">{t4('faq.lead')}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer onGo={go} onJoin={openJoin} />
      <JoinDialog open={joinOpen} onClose={closeJoin} />
    </div>
  );
}
