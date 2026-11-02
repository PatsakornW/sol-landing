'use client';

import { useCallback, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { progress, useScrollFrame } from '../hooks/use-scroll-frame';
import { MOCKS } from '../sample';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';

const GAP = 'clamp(18px, 2.4vw, 36px)';

const styles = stylex.create({
  mech: {
    paddingBlock: 'clamp(90px, 11vw, 170px)',
  },
  head: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    rowGap: 24,
    columnGap: 40,
  },
  headSub: {
    marginTop: 0,
    paddingBottom: '0.5em',
  },
  steps: {
    position: 'relative',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    marginTop: 'clamp(60px, 7vw, 100px)',
    display: { default: 'grid', [bp.max900]: 'flex' },
    flexDirection: 'column',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    columnGap: GAP,
    rowGap: { default: 0, [bp.max900]: 64 },
  },
  /* A line through the three markers, lit from the left as far as the page
     has scrolled, with a sun at the end of the lit part. */
  track: {
    position: 'absolute',
    top: 23,
    left: `calc((100% - 2 * ${GAP}) / 6)`,
    right: `calc((100% - 2 * ${GAP}) / 6)`,
    height: 1,
    backgroundColor: V3.line2,
    display: { default: 'block', [bp.max900]: 'none' },
  },
  trackFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundImage: `linear-gradient(90deg, ${V3.orchid}, ${V3.corona} 50%, ${V3.cobalt})`,
    boxShadow: '0 0 12px rgba(255, 214, 160, 0.6)',
  },
  trackDot: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    width: 14,
    height: 14,
    translate: '-50% -50%',
    borderRadius: '50%',
    backgroundColor: '#fff6e6',
    boxShadow: '0 0 0 5px rgba(255, 227, 179, 0.15), 0 0 26px 6px rgba(255, 214, 160, 0.8)',
  },
  step: {
    display: { default: 'grid', [bp.max900]: 'flex' },
    flexDirection: 'column',
    gridRowStart: 'span 4',
    gridTemplateRows: 'subgrid',
    alignContent: 'start',
  },
  marker: {
    position: 'relative',
    zIndex: 1,
    justifySelf: { default: 'center', [bp.max900]: 'start' },
    alignSelf: 'start',
    display: 'grid',
    placeItems: 'center',
    width: 46,
    height: 46,
    borderRadius: '50%',
    backgroundColor: V3.void,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    fontFamily: font.display,
    fontSize: 19,
    color: V3.dust,
    transitionProperty: 'color, border-color, box-shadow',
    transitionDuration: '0.6s',
  },
  markerLit: {
    color: V3.star,
    borderColor: 'rgba(255, 227, 179, 0.7)',
    boxShadow: '0 0 30px -4px rgba(255, 214, 160, 0.55)',
  },
  mock: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 22,
    borderRadius: 22,
    fontSize: 14,
    backgroundImage: 'linear-gradient(180deg, #0f0f2a, #08081a)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line,
    boxShadow: '0 50px 90px -50px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '0.6s',
  },
  mockLit: {
    borderColor: V3.line2,
    boxShadow:
      '0 50px 90px -50px rgba(0, 0, 0, 0.9), 0 0 80px -40px rgba(30, 105, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
  },
  title: {
    margin: 0,
    marginTop: 28,
    marginBottom: 10,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(25px, 2.2vw, 32px)',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    textWrap: 'balance',
  },
  body: {
    margin: 0,
    color: V3.dust,
    maxWidth: '34ch',
  },
});

/* The three screens the steps show. */
const mk = stylex.create({
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 6,
  },
  x: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: V3.dust,
  },
  opt: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingBlock: 12,
    paddingInline: 14,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.07)',
    fontWeight: 500,
  },
  optOn: {
    borderColor: 'rgba(220, 116, 236, 0.5)',
    backgroundColor: 'rgba(220, 116, 236, 0.08)',
  },
  optNote: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#8de0b0',
    fontStyle: 'normal',
  },
  ic: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 700,
    fontSize: 13,
  },
  icPhantom: {
    backgroundColor: '#ab9ff2',
    color: '#1c1640',
  },
  label: {
    margin: 0,
    marginTop: 6,
    fontSize: 12,
    color: V3.faint,
  },
  q: {
    margin: 0,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.3,
  },
  toggle: {
    display: 'flex',
    gap: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  toggleSide: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
    padding: 11,
    borderRadius: 11,
    fontWeight: 600,
  },
  toggleYes: {
    backgroundColor: V3.cobalt,
    color: '#fff',
    boxShadow: `0 8px 24px -8px ${V3.cobalt}`,
  },
  toggleNo: {
    backgroundColor: 'rgba(220, 116, 236, 0.13)',
    color: '#f2b9f9',
    boxShadow: 'inset 0 0 0 1px rgba(220, 116, 236, 0.42)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: 7,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    color: V3.dust,
  },
  rowValue: {
    color: V3.star,
    fontWeight: 600,
  },
  rowHl: {
    color: V3.corona,
  },
  rowOk: {
    color: '#8de0b0',
  },
  cta: {
    marginTop: 'auto',
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EFEDFA',
    color: '#06061a',
    fontWeight: 700,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingBlock: 4,
    paddingInline: 10,
    borderRadius: V3.pill,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'rgba(141, 224, 176, 0.12)',
    color: '#8de0b0',
  },
  won: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    fontFamily: font.display,
    fontSize: 30,
    letterSpacing: '-0.02em',
  },
  wonMark: {
    display: 'grid',
    placeItems: 'center',
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: V3.cobalt,
    boxShadow: `0 0 24px -2px ${V3.cobalt}`,
  },
  wonTick: {
    width: 16,
    height: 16,
  },
  pay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 8,
    marginBottom: 6,
  },
  payValue: {
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 48,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    color: V3.corona,
    textShadow: '0 0 30px rgba(255, 214, 160, 0.35)',
  },
  payUnit: {
    color: V3.dust,
    fontWeight: 600,
  },
});

function Row({ label, value, tone }: { label: string; value: string; tone: 'plain' | 'hl' | 'ok' }) {
  return (
    <div {...stylex.props(mk.row)}>
      <span>{label}</span>
      <b {...stylex.props(mk.rowValue, tone === 'hl' && mk.rowHl, tone === 'ok' && mk.rowOk)}>
        {value}
      </b>
    </div>
  );
}

function ConnectMock() {
  const c = MOCKS.connect;
  return (
    <>
      <div {...stylex.props(mk.head)}>
        {c.title}
        <span {...stylex.props(mk.x)}>×</span>
      </div>
      <div {...stylex.props(mk.opt)}>
        <span {...stylex.props(mk.ic)}>G</span>
        {c.google}
      </div>
      <div {...stylex.props(mk.opt)}>
        <span {...stylex.props(mk.ic)}>@</span>
        {c.email}
      </div>
      <p {...stylex.props(mk.label)}>{c.wallets}</p>
      <div {...stylex.props(mk.opt, mk.optOn)}>
        <span {...stylex.props(mk.ic, mk.icPhantom)}>P</span>
        {c.phantom}
        <em {...stylex.props(mk.optNote)}>{c.detected}</em>
      </div>
    </>
  );
}

function OrderMock() {
  const o = MOCKS.order;
  return (
    <>
      <p {...stylex.props(mk.q)}>{o.question}</p>
      <div {...stylex.props(mk.toggle)}>
        <span {...stylex.props(mk.toggleSide, mk.toggleYes)}>{o.yes}</span>
        <span {...stylex.props(mk.toggleSide, mk.toggleNo)}>{o.no}</span>
      </div>
      {o.rows.map((row) => (
        <Row key={row.label} {...row} />
      ))}
      <div {...stylex.props(mk.cta)}>{o.cta}</div>
    </>
  );
}

function ResolvedMock() {
  const r = MOCKS.resolved;
  return (
    <>
      <span {...stylex.props(mk.badge)}>{r.badge}</span>
      <div {...stylex.props(mk.won)}>
        <i {...stylex.props(mk.wonMark)}>
          <svg
            viewBox="0 0 24 24"
            {...stylex.props(mk.wonTick)}
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </i>
        {r.won}
      </div>
      <div {...stylex.props(mk.pay)}>
        <b {...stylex.props(mk.payValue)}>{r.payout}</b>
        <span {...stylex.props(mk.payUnit)}>{r.unit}</span>
      </div>
      {r.rows.map((row) => (
        <Row key={row.label} {...row} />
      ))}
    </>
  );
}

const SCREENS = [ConnectMock, OrderMock, ResolvedMock] as const;

export type Step = { title: string; desc: string; shot: string };

export type MechanismLabels = {
  title: string;
  sub: string;
  steps: readonly Step[];
};

/**
 * Three steps on one line. Each lights up as the page scrolls the line
 * through it; a reader who asked for less motion sees all three lit.
 */
export function Mechanism({ labels }: { labels: MechanismLabels }) {
  const stepsRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLElement>(null);
  const count = labels.steps.length;
  const [lit, setLit] = useState(count);

  const onFrame = useCallback(
    (reduce: boolean) => {
      const steps = stepsRef.current;
      if (!steps || reduce) return;
      const sp = progress(steps, 0.78, 0.3);
      if (fillRef.current) fillRef.current.style.width = `${(sp * 100).toFixed(2)}%`;
      if (dotRef.current) dotRef.current.style.left = `${(sp * 100).toFixed(2)}%`;
      let n = 0;
      for (let i = 0; i < count; i++) if (sp >= i / (count - 1) - 0.02) n = i + 1;
      setLit(n);
    },
    [count],
  );
  useScrollFrame(onFrame);

  return (
    <section
      id="mechanism"
      {...stylex.props(styles.mech, shared.section)}
      aria-labelledby="mech-title"
    >
      <div {...stylex.props(shared.wrap)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="mech-title" {...stylex.props(shared.h2)}>
            {labels.title}
          </h2>
          <p {...stylex.props(shared.sub, styles.headSub)}>{labels.sub}</p>
        </div>
        <ol ref={stepsRef} {...stylex.props(styles.steps)}>
          <li {...stylex.props(styles.track)} aria-hidden="true">
            <i ref={fillRef} {...stylex.props(styles.trackFill)} />
            <b ref={dotRef} {...stylex.props(styles.trackDot)} />
          </li>
          {labels.steps.map((step, index) => {
            const Screen = SCREENS[index] ?? ConnectMock;
            const on = index < lit;
            return (
              <li key={step.title} {...stylex.props(styles.step)}>
                <span {...stylex.props(styles.marker, on && styles.markerLit)} aria-hidden="true">
                  {index + 1}
                </span>
                <div {...stylex.props(styles.mock, on && styles.mockLit)} role="img" aria-label={step.shot}>
                  <Screen />
                </div>
                <h3 {...stylex.props(styles.title)}>{step.title}</h3>
                <p {...stylex.props(styles.body)}>{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
