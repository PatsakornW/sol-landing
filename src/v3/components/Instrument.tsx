'use client';

import { useEffect, useId, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';

const styles = stylex.create({
  instrument: {
    position: 'relative',
    marginTop: 'clamp(80px, 10vw, 150px)',
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1.3fr) minmax(0, 1fr)', [bp.max900]: '1fr' },
    gap: 'clamp(24px, 4vw, 72px)',
    alignItems: 'center',
    padding: 'clamp(22px, 4vw, 60px)',
    borderRadius: 32,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line,
    overflow: 'hidden',
    isolation: 'isolate',
    backgroundImage:
      'radial-gradient(60% 90% at 26% 50%, rgba(30, 105, 246, 0.13), transparent 70%), radial-gradient(50% 80% at 8% 40%, rgba(220, 116, 236, 0.1), transparent 70%)',
    backgroundColor: V3.void2,
    /* A faint grid behind the orbs, fading out towards the panel's edges. */
    '::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      opacity: 0.5,
      backgroundImage: `linear-gradient(${V3.line} 1px, transparent 1px), linear-gradient(90deg, ${V3.line} 1px, transparent 1px)`,
      backgroundSize: '56px 56px',
      maskImage: 'radial-gradient(70% 80% at 30% 50%, #000, transparent 75%)',
      WebkitMaskImage: 'radial-gradient(70% 80% at 30% 50%, #000, transparent 75%)',
    },
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  label: {
    fontFamily: font.display,
    fontSize: { default: 22, [bp.max600]: 40 },
    fill: V3.star,
    letterSpacing: '-0.01em',
  },
  labelKey: {
    fontFamily: font.sans,
    fontSize: { default: 13, [bp.max600]: 24 },
    fontWeight: 600,
    letterSpacing: '0.06em',
    fill: V3.dust,
  },
  eg: {
    margin: 0,
    fontSize: 14,
    color: V3.dust,
    fontWeight: 500,
  },
  question: {
    margin: 0,
    marginTop: 10,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(26px, 2.5vw, 36px)',
    lineHeight: 1.12,
    letterSpacing: '-0.02em',
    textWrap: 'balance',
  },
  price: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 22,
    fontFamily: font.display,
    lineHeight: 0.85,
  },
  priceValue: {
    fontWeight: 500,
    fontSize: 'clamp(96px, 10vw, 160px)',
    letterSpacing: '-0.05em',
    fontVariantNumeric: 'lining-nums tabular-nums',
    backgroundImage: 'linear-gradient(180deg, #fff 30%, #ffd9a0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  priceCent: {
    fontSize: 'clamp(36px, 3.6vw, 56px)',
    marginTop: '0.18em',
    color: V3.corona,
  },
  priceUnit: {
    alignSelf: 'flex-end',
    fontFamily: font.sans,
    fontSize: 14,
    color: V3.dust,
    marginBottom: '0.9em',
    marginLeft: 10,
    lineHeight: 1.3,
  },
  split: {
    display: 'flex',
    height: 44,
    marginTop: 22,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 600,
  },
  side: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingInline: 14,
    minWidth: 0,
    whiteSpace: 'nowrap',
  },
  yes: {
    flexGrow: 0,
    flexShrink: 0,
    transitionProperty: 'flex-basis',
    transitionDuration: '0.25s',
    transitionTimingFunction: 'ease',
    backgroundImage: `linear-gradient(90deg, #174fc4, ${V3.cobalt})`,
    color: '#fff',
  },
  no: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    color: '#fbe3ff',
    backgroundImage: `repeating-linear-gradient(to bottom, ${V3.orchid} 0 6px, #a54fb8 6px 8px)`,
  },
  rangeWrap: {
    marginTop: 22,
  },
  rangeLabel: {
    display: 'block',
    fontSize: 14,
    color: V3.dust,
    marginBottom: 6,
  },
  /* The slider is the page's one control: a thin two-colour track, a sun for
     a thumb. */
  range: {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
    height: 34,
    margin: 0,
    backgroundColor: 'transparent',
    cursor: { default: 'grab', ':active': 'grabbing' },
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
    borderRadius: 6,
    '::-webkit-slider-runnable-track': {
      height: 4,
      borderRadius: 4,
      backgroundImage: `linear-gradient(90deg, ${V3.cobalt} 0 var(--v, 63%), ${V3.orchid} var(--v, 63%) 100%)`,
    },
    '::-moz-range-track': {
      height: 4,
      borderRadius: 4,
      backgroundImage: `linear-gradient(90deg, ${V3.cobalt} 0 var(--v, 63%), ${V3.orchid} var(--v, 63%) 100%)`,
    },
    '::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: 26,
      height: 26,
      marginTop: -11,
      borderRadius: '50%',
      borderWidth: 0,
      backgroundImage: 'radial-gradient(circle at 35% 30%, #fff, #ffe3b3 55%, #ffad60)',
      boxShadow: '0 0 0 7px rgba(255, 227, 179, 0.13), 0 0 26px 5px rgba(255, 214, 160, 0.55)',
    },
    '::-moz-range-thumb': {
      width: 26,
      height: 26,
      borderRadius: '50%',
      borderWidth: 0,
      backgroundImage: 'radial-gradient(circle at 35% 30%, #fff, #ffe3b3 55%, #ffad60)',
      boxShadow: '0 0 0 7px rgba(255, 227, 179, 0.13), 0 0 26px 5px rgba(255, 214, 160, 0.55)',
    },
  },
  explain: {
    margin: 0,
    marginTop: 18,
    fontSize: 17,
    lineHeight: 1.55,
    color: '#d8d5ee',
    maxWidth: '46ch',
  },
});

const basis = stylex.create({
  at: (percent: number) => ({ flexBasis: `${percent}%` }),
});

export type InstrumentLabels = {
  figure: string;
  eg: string;
  question: string;
  unitA: string;
  unitB: string;
  yes: string;
  no: string;
  drag: string;
  /** The second half of the explanation, after the odds have been spelled out. */
  tail: string;
  fine: string;
};

/* The drawing's measures: the canvas is 640 × 480, the orbs sit on one line. */
const CY = 215;
const BASE = 128;
const START = 63;

/** Where the two orbs sit for a YES price of `p` cents: areas in proportion. */
function geometry(p: number) {
  const k = p / 100;
  const rY = BASE * Math.sqrt(2 * k);
  const rN = BASE * Math.sqrt(2 * (1 - k));
  const d = (rY + rN) * 0.74;
  const span = rN + d + rY;
  const cxN = (640 - span) / 2 + rN;
  return { rY, rN, cxN, cxY: cxN + d, labelY: CY + Math.max(rN, rY) + 40 };
}

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function say(n: number): string {
  if (n < 20) return ONES[n] ?? String(n);
  const tens = TENS[Math.floor(n / 10)] ?? '';
  const ones = n % 10;
  return ones ? `${tens}-${ONES[ones]}` : tens;
}
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const article = (word: string) => (/^(eight|eleven)/.test(word) ? 'an' : 'a');

/**
 * The claim, as something to hold: two orbs whose areas are the two prices,
 * and a slider that reprices the market.
 *
 * The orbs follow the slider through a short ease rather than snapping, so
 * the drawing is written to directly from a frame loop; the figures beside
 * it are React state and change on the input.
 */
export function Instrument({ labels }: { labels: InstrumentLabels }) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `v3-ecl-${name}-${uid}`;
  const [p, setP] = useState(START);
  const rangeRef = useRef<HTMLInputElement>(null);
  const orbN = useRef<SVGCircleElement>(null);
  const orbY = useRef<SVGCircleElement>(null);
  const lens = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const clip = useRef<SVGCircleElement>(null);
  const atmN = useRef<SVGCircleElement>(null);
  const atmY = useRef<SVGCircleElement>(null);
  const textN = useRef<SVGTextElement>(null);
  const textY = useRef<SVGTextElement>(null);
  const motion = useRef({ current: START, target: START, frame: 0 });

  const draw = (value: number) => {
    const g = geometry(value);
    const set = (el: SVGCircleElement | null, cx: number, r: number) => {
      if (!el) return;
      el.setAttribute('cx', cx.toFixed(2));
      el.setAttribute('cy', String(CY));
      el.setAttribute('r', Math.max(r, 0.1).toFixed(2));
    };
    set(orbN.current, g.cxN, g.rN);
    set(lens.current, g.cxN, g.rN);
    set(halo.current, g.cxN, g.rN);
    set(atmN.current, g.cxN, g.rN * 1.05);
    set(orbY.current, g.cxY, g.rY);
    set(clip.current, g.cxY, g.rY);
    set(atmY.current, g.cxY, g.rY * 1.05);
    const labelY = g.labelY.toFixed(1);
    textN.current?.setAttribute('x', g.cxN.toFixed(1));
    textN.current?.setAttribute('y', labelY);
    textY.current?.setAttribute('x', g.cxY.toFixed(1));
    textY.current?.setAttribute('y', labelY);
  };

  useEffect(() => {
    rangeRef.current?.style.setProperty('--v', `${START}%`);
    const state = motion.current;
    return () => cancelAnimationFrame(state.frame);
  }, []);

  const onInput = (value: number) => {
    setP(value);
    rangeRef.current?.style.setProperty('--v', `${value}%`);
    const state = motion.current;
    state.target = value;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => {
      state.current += (state.target - state.current) * (reduce ? 1 : 0.16);
      if (Math.abs(state.target - state.current) < 0.02) state.current = state.target;
      draw(state.current);
      state.frame = state.current !== state.target ? requestAnimationFrame(step) : 0;
    };
    if (!state.frame) state.frame = requestAnimationFrame(step);
  };

  const no = 100 - p;
  const word = say(p);
  const initial = geometry(START);

  return (
    <div {...stylex.props(styles.instrument)}>
      <svg
        viewBox="0 0 640 480"
        {...stylex.props(styles.svg)}
        role="img"
        aria-labelledby={id('title')}
      >
        <title id={id('title')}>{labels.figure}</title>
        <defs>
          <radialGradient id={id('gYes')} cx="34%" cy="30%" r="78%">
            <stop offset="0" stopColor="#a9c8ff" />
            <stop offset=".32" stopColor="#2f78ff" />
            <stop offset=".78" stopColor="#1544b8" />
            <stop offset="1" stopColor="#091a55" />
          </radialGradient>
          <radialGradient id={id('gNo')} cx="34%" cy="30%" r="78%">
            <stop offset="0" stopColor="#f8cdfd" />
            <stop offset=".38" stopColor="#dc74ec" />
            <stop offset="1" stopColor="#4f1a60" />
          </radialGradient>
          <radialGradient id={id('gLens')} cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset=".55" stopColor="#ffe9c4" />
            <stop offset="1" stopColor="#ffb46e" />
          </radialGradient>
          <pattern id={id('slit')} width="10" height="16" patternUnits="userSpaceOnUse">
            <rect width="10" height="16" fill="#fff" />
            <rect y="12.5" width="10" height="3.5" fill="#000" />
          </pattern>
          <mask id={id('mSlit')} maskUnits="userSpaceOnUse" x="-50" y="-50" width="740" height="580">
            <rect x="-50" y="-50" width="740" height="580" fill={`url(#${id('slit')})`} />
          </mask>
          <clipPath id={id('cYes')}>
            <circle ref={clip} cx={initial.cxY} cy={CY} r={initial.rY} />
          </clipPath>
          <filter id={id('fBlur')} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id={id('fSoft')} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <circle
          ref={atmN}
          cx={initial.cxN}
          cy={CY}
          r={initial.rN * 1.05}
          fill="#DC74EC"
          opacity=".22"
          filter={`url(#${id('fSoft')})`}
        />
        <circle
          ref={atmY}
          cx={initial.cxY}
          cy={CY}
          r={initial.rY * 1.05}
          fill="#1E69F6"
          opacity=".28"
          filter={`url(#${id('fSoft')})`}
        />
        <g filter={`url(#${id('fBlur')})`}>
          <circle
            ref={halo}
            cx={initial.cxN}
            cy={CY}
            r={initial.rN}
            fill="#ffd9a0"
            clipPath={`url(#${id('cYes')})`}
          />
        </g>
        <circle
          ref={orbN}
          cx={initial.cxN}
          cy={CY}
          r={initial.rN}
          fill={`url(#${id('gNo')})`}
          mask={`url(#${id('mSlit')})`}
        />
        <circle ref={orbY} cx={initial.cxY} cy={CY} r={initial.rY} fill={`url(#${id('gYes')})`} />
        <circle
          ref={lens}
          cx={initial.cxN}
          cy={CY}
          r={initial.rN}
          fill={`url(#${id('gLens')})`}
          clipPath={`url(#${id('cYes')})`}
        />
        <text
          ref={textN}
          {...stylex.props(styles.label)}
          x={initial.cxN}
          y={initial.labelY}
          textAnchor="middle"
        >
          <tspan {...stylex.props(styles.labelKey)}>NO </tspan>
          <tspan>{no}¢</tspan>
        </text>
        <text
          ref={textY}
          {...stylex.props(styles.label)}
          x={initial.cxY}
          y={initial.labelY}
          textAnchor="middle"
        >
          <tspan {...stylex.props(styles.labelKey)}>YES </tspan>
          <tspan>{p}¢</tspan>
        </text>
      </svg>

      <div>
        <p {...stylex.props(styles.eg)}>{labels.eg}</p>
        <h3 {...stylex.props(styles.question)}>{labels.question}</h3>
        <div {...stylex.props(styles.price)} aria-live="polite">
          <b {...stylex.props(styles.priceValue)}>{p}</b>
          <span {...stylex.props(styles.priceCent)}>¢</span>
          <small {...stylex.props(styles.priceUnit)}>
            {labels.unitA}
            <br />
            {labels.unitB}
          </small>
        </div>
        <div {...stylex.props(styles.split)} aria-hidden="true">
          <div {...stylex.props(styles.side, styles.yes, basis.at(p))}>
            <span>{labels.yes}</span>
            <b>{p}%</b>
          </div>
          <div {...stylex.props(styles.side, styles.no)}>
            <b>{no}%</b>
            <span>{labels.no}</span>
          </div>
        </div>
        <div {...stylex.props(styles.rangeWrap)}>
          <label htmlFor={id('range')} {...stylex.props(styles.rangeLabel)}>
            {labels.drag}
          </label>
          <input
            ref={rangeRef}
            id={id('range')}
            {...stylex.props(styles.range)}
            type="range"
            min={1}
            max={99}
            value={p}
            onChange={(event) => onInput(Number(event.currentTarget.value))}
            aria-valuetext={`${labels.yes} ${p} percent, ${labels.no} ${no} percent`}
          />
        </div>
        <p {...stylex.props(styles.explain)}>
          {capitalise(word)} cent{p === 1 ? '' : 's'} to win a dollar is {article(word)} {word}{' '}
          percent chance — {labels.tail}
        </p>
        <p {...stylex.props(shared.fine)}>{labels.fine}</p>
      </div>
    </div>
  );
}
