'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BRAND } from '../../brand';
import { Cards } from '../../components/Cards';
import { Chrome, LINKS, type LinkKey } from '../../components/Chrome';
import { Field } from '../../components/Field';
import { Footer } from '../../components/Footer';
import { Wallet, ChevronDown } from '../../components/Icons';
import { JoinDialog } from '../../components/JoinDialog';
import { Questions } from '../../components/Questions';
import { Flow, Pair, paintPrice, PRICE, PriceCard } from '../../components/Scenes';
import { scrollToTarget, Smooth } from '../../components/Smooth';
import { t8 } from '../../i18n/messages';
import { initialField } from '../../lib/field';
import { gsap, reducedMotion, ScrollTrigger, STAGE_QUERY } from '../../lib/motion';
import { playFan, playFlow, playPrice, playStack, vh } from '../../lib/plays';

const STEPS = ['custody', 'matching', 'settlement', 'resolution'] as const;

/** The stage timeline's length, in its own units; the track gives each one 40% of a screen. */
const TOTAL = 52;

/** Where each header link lands on the stage timeline. */
const MARKS: Record<LinkKey, number> = { top: 0, how: 3.6, price: 14, flow: 20.8, vault: 32.6, markets: 38.6, faq: 41.8 };

/** Where each section's stretch of the stage timeline begins, for the lit link. */
const STARTS: [LinkKey, number][] = [
  ['top', 0],
  ['how', 2],
  ['price', 11.4],
  ['flow', 15.4],
  ['vault', 23.6],
  ['markets', 36.2],
  ['faq', 40.8],
];

/** The section that owns a point on the stage timeline. */
function sectionAt(t: number): LinkKey {
  let key: LinkKey = 'top';
  for (const [k, at] of STARTS) if (t >= at) key = k;
  return key;
}

/* The field behind the page. One object for the life of the page: the
   timeline writes into it and the shader loop reads it. */
const field = initialField();

/** The bar above each step's word: what that step looks like in the app. */
function StepBar({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className={`bar bar--${step}`} aria-hidden="true">
      {step === 'custody' ? <span className="bar__lead">{t8(`steps.${step}.bar`)}</span> : null}
      {step === 'matching' ? (
        <>
          <span className="bar__slash">/</span>
          <span className="bar__lead">{t8(`steps.${step}.bar`)}</span>
        </>
      ) : null}
      {step === 'settlement' ? (
        <>
          <span className="bar__dot" />
          <span className="bar__lead">{t8(`steps.${step}.bar`)}</span>
        </>
      ) : null}
      {step === 'resolution' ? <span className="bar__lead">{t8(`steps.${step}.bar`)}</span> : null}
      <span className="bar__end">
        {step === 'custody' ? <Wallet /> : null}
        {step === 'matching' ? (
          <span className="bar__chip">
            {t8(`steps.${step}.chip`)}
            <ChevronDown />
          </span>
        ) : null}
        {step === 'settlement' ? (
          <>
            {t8(`steps.${step}.chip`)}
            <span className="bar__toggle" />
          </>
        ) : null}
        {step === 'resolution' ? <span className="bar__chip">{t8(`steps.${step}.chip`)}</span> : null}
      </span>
    </div>
  );
}

/**
 * Revision 8 — the glass stage, carrying the sols_market landing page's words.
 *
 * On a wide screen the whole page is one fixed stage scrubbed by the scroll:
 * a colour field behind fluted glass sinks under the hero, the four steps rise
 * through a wash that runs blue to rose, a price card counts up to what a Yes
 * share costs, two orders match off-chain and settle as a batch on Solana, a
 * Yes coin and a No coin close into the mark over the solid USDC, the desk
 * cards fan in, the six questions stack one card at a time, and the footer pushes
 * the scenes up over the same field. On a tablet or a phone — or with
 * reduced motion — the same scenes stack and rise in as they enter. On every
 * load the field blooms out of the dark and the hero's lines come in one by one.
 */
export function HomeView() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [stage, setStage] = useState<boolean | null>(null);
  const [active, setActive] = useState<LinkKey>('top');

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);

  // The load-in: the field blooms out of the dark while the hero's lines come in (CSS).
  useEffect(() => {
    if (reducedMotion()) return;
    field.intro = 0;
    const bloom = gsap.to(field, { intro: 1, duration: 2.4, delay: 0.1, ease: 'power2.out' });
    return () => {
      bloom.kill();
      field.intro = 1;
    };
  }, []);

  // Stage or stack, from the same test the layout's inline script ran.
  useEffect(() => {
    const mq = window.matchMedia(STAGE_QUERY);
    const apply = () => {
      document.documentElement.classList.toggle('is-stage', mq.matches);
      setStage(mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // The stage: one timeline over the whole track.
  useEffect(() => {
    if (!stage || !root.current || !track.current) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      gsap.set(q('.scene:not(.hero)'), { autoAlpha: 0 });
      // The sheet parks the footer a screen down; the timeline takes that over as yPercent.
      gsap.set(q('.foot'), { y: 0, yPercent: 100 });

      /* 0 — the hero lifts and blurs away; the field sinks and dims. */
      tl.to(q('.hero__inner'), { autoAlpha: 0, y: -90, filter: 'blur(12px)', duration: 1.7 }, 0.25);
      tl.to(field, { blobScale: 0.6, blobY: 0.46, blob: 0.7, duration: 2.8 }, 0);
      tl.to(field, { blob: 0, duration: 1.6 }, 4.2);

      /* 2 — "How it works" rises through the screen. */
      tl.set(q('.how'), { autoAlpha: 1 }, 2);
      tl.fromTo(q('.how__inner'), { y: vh(58) }, { y: vh(-52), duration: 3.8 }, 2);
      tl.fromTo(q('.how__inner'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2);
      tl.to(q('.how__inner'), { opacity: 0, duration: 0.6 }, 5.2);

      /* 3.4 — the four steps run up the screen as one column, the wash going
         from blue to rose under them. Each step is centred at about
         5.9, 7.2, 8.5 and 9.8. */
      tl.set(q('.steps'), { autoAlpha: 1 }, 3.4);
      tl.fromTo(q('.steps__col'), { y: vh(105) }, { y: vh(-228), duration: 7.8 }, 3.4);
      tl.to(field, { wash: 1, duration: 1.6 }, 3.8);
      tl.fromTo(field, { step: 0 }, { step: 3, duration: 3.9 }, 5.9);
      tl.to(field, { taper: 1, duration: 1.4 }, 9.8);
      tl.to(field, { wash: 0, duration: 1.4 }, 10.4);
      tl.set(q('.steps'), { autoAlpha: 0 }, 11.3);

      /* From here to the footer the blob is back behind every scene, turning
         with the scroll — brighter between the reading stops, softer under text. */
      tl.to(field, { blob: 0.8, blobY: 0, blobScale: 1.15, taper: 0, duration: 1.6 }, 10.6);
      tl.fromTo(field, { blobRot: 0 }, { blobRot: 5.4, duration: 37 }, 11);
      tl.to(field, { blob: 0.55, blobScale: 1.35, duration: 1 }, 15.2);
      tl.to(field, { blob: 0.85, blobScale: 1.05, duration: 1 }, 23.4);
      tl.to(field, { blob: 0.75, blobScale: 1.2, duration: 1 }, 36);
      tl.to(field, { blob: 0.5, blobScale: 1.4, duration: 1 }, 40.6);

      /* 11.4 — the price card: the Yes price counts up from nothing, the bar
         filling from 0 toward 1 USDC, and the reading comes in beside it. */
      tl.set(q('.show'), { autoAlpha: 1 }, 11.4);
      tl.fromTo(q('.show__text'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 11.5);
      tl.fromTo(
        q('.show .price'),
        { autoAlpha: 0, y: 80, rotationX: 18, scale: 0.92 },
        { autoAlpha: 1, y: 0, rotationX: 0, scale: 1, duration: 1.4, ease: 'power2.out' },
        11.6,
      );
      playPrice(tl, root.current!, 12.4);
      tl.fromTo(q('.show__side'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 13.4);
      tl.to(q('.show__text, .show .price'), { autoAlpha: 0, y: -60, duration: 0.7, stagger: 0.1 }, 14.8);

      /* 15 — off-chain into on-chain: two orders meet in the book and match,
         the match runs down the wire, and lands on Solana as the newest batch. */
      tl.set(q('.desk'), { autoAlpha: 1 }, 15.4);
      tl.fromTo(q('.desk__side'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1 }, 15.4);
      tl.fromTo(q('.flow__panel'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.25 }, 15.7);
      playFlow(tl, q, 16.4);
      tl.to(q('.desk__inner'), { autoAlpha: 0, y: -60, duration: 1 }, 22.3);
      tl.set(q('.desk'), { autoAlpha: 0 }, 23.5);

      /* 23.6 — a Yes coin and a No coin slide in from either side and close
         into the mark: the pair, and the one USDC behind it. Then the pair
         rises and the outlined word pulls back under it. */
      tl.set(q('.vault'), { autoAlpha: 1 }, 23.6);
      tl.fromTo(
        q('.pair__coin--yes'),
        { x: () => -window.innerWidth * 0.42, rotation: -120, autoAlpha: 0 },
        { x: 0, rotation: 0, autoAlpha: 1, duration: 3, ease: 'power2.out' },
        23.8,
      );
      tl.fromTo(
        q('.pair__coin--no'),
        { x: () => window.innerWidth * 0.42, rotation: 120, autoAlpha: 0 },
        { x: 0, rotation: 0, autoAlpha: 1, duration: 3, ease: 'power2.out' },
        23.8,
      );
      tl.to(q('.pair__coin span'), { autoAlpha: 0, duration: 0.5 }, 27);
      tl.fromTo(q('.pair'), { '--gap': 1 }, { '--gap': 0, duration: 1, ease: 'power2.inOut' }, 26.6);
      tl.fromTo(q('.pair__sum'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 27.6);
      tl.to(q('.pair__sum'), { autoAlpha: 0, duration: 0.5 }, 29);
      tl.to(q('.pair'), { y: vh(-34), scale: 0.42, duration: 2, ease: 'power2.inOut' }, 29);
      tl.fromTo(q('.vault__word'), { scale: 3.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.6, ease: 'power1.out' }, 29.6);
      tl.fromTo(q('.vault__body'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 32);
      tl.to(q('.vault__inner, .pair'), { y: vh(-70), duration: 1.8 }, 33.8);
      tl.to(q('.vault__inner, .pair'), { autoAlpha: 0, duration: 1 }, 35);
      tl.set(q('.vault'), { autoAlpha: 0 }, 36.1);

      /* 35.4 — the desk cards fan in together while the word is still
         leaving, so the section never opens empty. */
      tl.set(q('.markets'), { autoAlpha: 1 }, 35.4);
      tl.fromTo(q('.markets__title'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 35.6);
      playFan(tl, q, 35.4);
      tl.fromTo(q('.markets__more'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 36.4);
      tl.to(q('.markets__inner'), { y: vh(-80), duration: 2 }, 39.6);
      tl.to(q('.markets__inner'), { autoAlpha: 0, duration: 0.6 }, 41);
      tl.set(q('.markets'), { autoAlpha: 0 }, 41.7);

      /* 40.8 — the questions as a stack: one card in view, and each stretch
         of scroll lays the next over it while the ones beneath step back. */
      tl.set(q('.faq'), { autoAlpha: 1 }, 40.8);
      tl.fromTo(q('.faq__head'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 40.8);
      tl.fromTo(q('.qs__tile')[0]!, { y: vh(95), rotation: -3 }, { y: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 40.9);
      playStack(tl, q, 41.1);
      tl.fromTo(q('.qs__cta'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 48.2);

      /* 48.8 — the footer pushes the scenes and the chrome up. The field stays
         where it is, so the light runs on behind the footer without a seam. */
      tl.to(field, { blob: 1, blobScale: 1.1, duration: 2.4 }, 48.8);
      tl.to(q('.scenes, .chrome'), { y: vh(-100), duration: 2.4 }, 48.8);
      tl.to(q('.foot'), { yPercent: 0, duration: 2.4 }, 48.8);
      tl.set({}, {}, TOTAL);

      trigger.current = ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(sectionAt(self.progress * TOTAL)),
      });
    }, root);

    return () => {
      trigger.current = null;
      ctx.revert();
      if (root.current) paintPrice(root.current, PRICE);
      Object.assign(field, initialField());
    };
  }, [stage]);

  // The stack: lines and blocks rise in as they enter, the field turns with the scroll, and the link lights for the section in view.
  useEffect(() => {
    if (stage !== false || !root.current) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    root.current.querySelectorAll('.rv').forEach((el) => io.observe(el));

    /* With motion allowed, three scenes pin to the screen while the scroll
       plays them, as on the stage: the price counts up, the orders match and
       settle, and the questions stack one by one; the desk cards fan in as
       their section scrolls up. */
    const el = root.current;
    const q = gsap.utils.selector(el);
    const html = document.documentElement;
    const pins = gsap.context(() => {
      if (reducedMotion()) return;
      html.classList.add('is-pin');
      const pin = (selector: string, screens: number, build: (tl: gsap.core.Timeline) => void) => {
        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        build(tl);
        ScrollTrigger.create({ trigger: q(selector)[0], start: 'top top', end: `+=${screens * 100}%`, pin: true, scrub: 0.6, animation: tl });
      };
      pin('.show', 1, (tl) => playPrice(tl, el, 0, 1));
      pin('.desk', 1.6, (tl) => playFlow(tl, q, 0, true));
      pin('.faq', 3.2, (tl) => playStack(tl, q, 0, 1));
      // The desk cards need no pin: they fan out as the section scrolls up, starting only a little low so it never opens empty.
      const fan = gsap.timeline({ defaults: { ease: 'none' } });
      playFan(fan, q, 0, 1, 22);
      ScrollTrigger.create({ trigger: q('.markets')[0], start: 'top 90%', end: 'top 20%', scrub: 0.6, animation: fan });
      ScrollTrigger.refresh();
    }, el);

    // The field sits behind the whole stack, turning as the page scrolls.
    const turn = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        field.blobRot = self.progress * 6;
        field.blob = 1 - 0.35 * Math.min(1, self.progress * 12);
        let key: LinkKey = 'top';
        for (const k of LINKS) {
          const sec = document.getElementById(`v8-${k}`);
          if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.4) key = k;
        }
        setActive(key);
      },
    });
    return () => {
      io.disconnect();
      pins.revert();
      html.classList.remove('is-pin');
      turn.kill();
      paintPrice(el, PRICE);
      Object.assign(field, initialField());
    };
  }, [stage]);

  const go = useCallback((key: LinkKey) => {
    const st = trigger.current;
    if (st) {
      scrollToTarget(st.start + ((st.end - st.start) * MARKS[key]) / TOTAL);
      return;
    }
    if (key === 'top') scrollToTarget(0);
    else {
      const el = document.getElementById(`v8-${key}`);
      if (el) scrollToTarget(el);
    }
  }, []);

  return (
    <div ref={root} className="v8">
      <Smooth />
      <div className="stage">
        <Field state={field} className="stage__bg" />
        <main className="scenes">
          <section className="scene hero" id="v8-top">
            <div className="hero__inner">
              <p className="pill pill--tag hero__badge">{t8('hero.badge')}</p>
              <h1 className="hero__word">{BRAND}</h1>
              <p className="hero__lead">{t8('hero.lead')}</p>
              <button type="button" className="btn btn--line hero__cta" onClick={openJoin} aria-haspopup="dialog">
                {t8('hero.cta')}
              </button>
            </div>
          </section>

          <section className="scene how" id="v8-how" aria-labelledby="v8-how-t">
            <div className="how__inner rv">
              <p className="pill pill--tag">{t8('how.eyebrow')}</p>
              <h2 className="how__title" id="v8-how-t">
                {t8('how.title')}
              </h2>
            </div>
          </section>

          <section className="scene steps" aria-label={t8('how.eyebrow')}>
            <ol className="steps__col">
              {STEPS.map((s) => (
                <li key={s} className={`step step--${s}`}>
                  <div className="step__inner rv">
                    <StepBar step={s} />
                    <h3 className="step__word">{t8(`steps.${s}.word`)}</h3>
                    <p className="step__desc">{t8(`steps.${s}.desc`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="scene show" id="v8-price" aria-labelledby="v8-show-t">
            <div className="show__text">
              <h2 className="show__title rv" id="v8-show-t">
                {t8('price.title')}
              </h2>
              <div className="show__side rv">
                <h3>{t8('price.sideTitle')}</h3>
                <p>{t8('price.side')}</p>
              </div>
            </div>
            <PriceCard />
          </section>

          <section className="scene desk" id="v8-flow" aria-labelledby="v8-desk-t">
            <div className="desk__inner">
              <div className="desk__side rv">
                <h3 id="v8-desk-t">{t8('flow.title')}</h3>
                <p>{t8('flow.body')}</p>
              </div>
              <Flow />
            </div>
          </section>

          <section className="scene vault" id="v8-vault" aria-labelledby="v8-vault-t">
            <Pair />
            <div className="vault__inner">
              <h2 className="vault__word" id="v8-vault-t">
                {t8('vault.word')}
              </h2>
              <p className="vault__body rv">{t8('vault.body')}</p>
            </div>
          </section>

          <section className="scene markets" id="v8-markets" aria-labelledby="v8-markets-t">
            <div className="markets__inner">
              <h2 className="markets__title rv" id="v8-markets-t">
                {t8('markets.title')}
              </h2>
              <Cards />
              <button type="button" className="btn btn--line markets__more" onClick={() => go('faq')}>
                {t8('markets.more')}
              </button>
            </div>
          </section>

          <section className="scene faq" id="v8-faq" aria-labelledby="v8-faq-t">
            <div className="faq__col">
              <div className="faq__head rv">
                <h2 className="faq__title" id="v8-faq-t">
                  {t8('faq.before')}
                  <span className="faq__braces">{'{}'}</span>
                  {t8('faq.after')}
                </h2>
                <p className="faq__lead">{t8('faq.lead')}</p>
              </div>
              <Questions onJoin={openJoin} />
            </div>
          </section>
        </main>
      </div>
      <div className="track" ref={track} aria-hidden="true" />
      <Footer />
      <Chrome active={active} onGo={go} onJoin={openJoin} />
      <JoinDialog open={joinOpen} onClose={closeJoin} />
    </div>
  );
}
