'use client';

import { useCallback, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { progress, useScrollFrame } from '../hooks/use-scroll-frame';
import { APP, chartPath } from '../sample';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';
import { Orbs } from './Orbs';

/** The width the mock is drawn at; the window scales it down from here. */
const MOCK_WIDTH = 1180;

const styles = stylex.create({
  app: {
    paddingTop: 'clamp(40px, 6vw, 90px)',
    paddingBottom: 'clamp(110px, 13vw, 200px)',
    textAlign: 'center',
  },
  sub: {
    marginInline: 'auto',
  },
  stage: {
    position: 'relative',
    margin: 0,
    marginTop: 'clamp(56px, 7vw, 100px)',
    paddingInline: V3.gutter,
    perspective: '1900px',
  },
  glow: {
    position: 'absolute',
    left: '50%',
    top: '18%',
    width: 'min(1500px, 130%)',
    height: '95%',
    translate: '-50% 0',
    pointerEvents: 'none',
    zIndex: -1,
    backgroundImage:
      'radial-gradient(50% 50% at 50% 60%, rgba(30, 105, 246, 0.42), rgba(220, 116, 236, 0.16) 50%, transparent 72%)',
    filter: 'blur(40px)',
  },
  arc: {
    position: 'absolute',
    left: '50%',
    top: '-8%',
    width: 'min(1700px, 150%)',
    aspectRatio: 2.4,
    translate: '-50% 0',
    borderRadius: '50%',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'rgba(255, 227, 179, 0.35)',
    zIndex: -1,
    maskImage: 'linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent)',
    WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent)',
    boxShadow: '0 -1px 40px -6px rgba(255, 214, 160, 0.35)',
  },
  /* The window leans back and shrinks until the page scrolls it upright. */
  device: {
    maxWidth: 1180,
    marginInline: 'auto',
    textAlign: 'left',
    borderRadius: { default: 18, [bp.max600]: 12 },
    overflow: 'hidden',
    backgroundColor: '#06061a',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    boxShadow:
      '0 0 0 1px rgba(255, 255, 255, 0.02), 0 80px 160px -50px rgba(30, 105, 246, 0.55), 0 40px 90px -40px rgba(0, 0, 0, 0.9)',
    transformOrigin: '50% 0',
    willChange: 'transform',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: { default: 7, [bp.max600]: 5 },
    paddingBlock: { default: 12, [bp.max600]: 7 },
    paddingInline: { default: 16, [bp.max600]: 10 },
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#09091f',
  },
  dot: {
    width: { default: 10, [bp.max600]: 7 },
    height: { default: 10, [bp.max600]: 7 },
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  host: {
    marginInline: 'auto',
    paddingBlock: { default: 4, [bp.max600]: 2 },
    paddingInline: { default: 40, [bp.max600]: 18 },
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: { default: 12, [bp.max600]: 10 },
    color: V3.dust,
  },
  fit: {
    position: 'relative',
    overflow: 'hidden',
  },
  /* The mock's box, scaled from its top-left corner to the window's width. */
  mockWrap: {
    width: MOCK_WIDTH,
    transformOrigin: '0 0',
    willChange: 'transform',
  },
  caption: {
    marginTop: 30,
    fontSize: 14,
    color: V3.faint,
  },
});

/* The app itself is drawn at one width and scaled to the window. */
const ui = stylex.create({
  root: {
    width: MOCK_WIDTH,
    fontSize: 14,
    lineHeight: 1.4,
    color: '#e8e7f5',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    gap: 22,
    paddingBlock: 16,
    paddingInline: 24,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
  },
  brandMark: {
    width: 20,
    height: 20,
  },
  brandSols: {
    fontWeight: 700,
    color: '#fff',
  },
  brandMarket: {
    color: '#8f8cad',
  },
  search: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 340,
    paddingBlock: 9,
    paddingInline: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.07)',
    color: '#77749a',
    fontSize: 13,
  },
  nav: {
    display: 'flex',
    gap: 20,
    marginLeft: 'auto',
    color: '#9a97b8',
    fontSize: 13,
  },
  navOn: {
    color: '#fff',
  },
  connect: {
    paddingBlock: 9,
    paddingInline: 16,
    borderRadius: V3.pill,
    backgroundColor: '#EFEDFA',
    color: '#06061a',
    fontWeight: 600,
    fontSize: 13,
  },
  body: {
    display: 'grid',
    gap: 18,
    paddingTop: 22,
    paddingInline: 24,
    paddingBottom: 26,
  },
  series: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.15fr',
    gap: 28,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundImage: 'linear-gradient(135deg, rgba(30, 105, 246, 0.17), rgba(220, 116, 236, 0.07) 70%)',
  },
  live: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    paddingBlock: 5,
    paddingInline: 11,
    borderRadius: V3.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    fontSize: 12,
    color: '#d0cde9',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: '#ff5a6e',
    boxShadow: '0 0 8px #ff5a6e',
  },
  question: {
    margin: 0,
    marginTop: 14,
    marginBottom: 8,
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: '-0.015em',
  },
  meta: {
    margin: 0,
    fontSize: 13,
    color: '#8f8cad',
  },
  big: {
    display: 'flex',
    gap: 10,
    marginTop: 24,
  },
  bigSide: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
    padding: 13,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
  },
  yes: {
    backgroundColor: 'rgba(30, 105, 246, 0.18)',
    color: '#9cc0ff',
    boxShadow: 'inset 0 0 0 1px rgba(30, 105, 246, 0.5)',
  },
  no: {
    backgroundColor: 'rgba(220, 116, 236, 0.13)',
    color: '#f2b9f9',
    boxShadow: 'inset 0 0 0 1px rgba(220, 116, 236, 0.42)',
  },
  pct: {
    fontSize: 34,
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  pctSmall: {
    fontSize: 14,
    color: '#8f8cad',
    fontWeight: 500,
    marginLeft: 6,
  },
  chart: {
    width: '100%',
    height: 150,
    marginTop: 4,
  },
  ranges: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 4,
    fontSize: 12,
    color: '#8f8cad',
  },
  range: {
    paddingBlock: 4,
    paddingInline: 9,
    borderRadius: 7,
  },
  chipOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: 13,
    maskImage: 'linear-gradient(90deg, #000 85%, transparent)',
    WebkitMaskImage: 'linear-gradient(90deg, #000 85%, transparent)',
  },
  trendLabel: {
    fontWeight: 600,
    marginRight: 4,
  },
  trendChip: {
    paddingBlock: 8,
    paddingInline: 13,
    borderRadius: V3.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#cfcce6',
  },
  trendPct: {
    color: '#9cc0ff',
    fontWeight: 600,
    fontStyle: 'normal',
    marginLeft: 6,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    fontSize: 13,
    color: '#9a97b8',
  },
  tab: {
    paddingBlock: 7,
    paddingInline: 12,
    borderRadius: 9,
  },
  sort: {
    fontSize: 13,
    color: '#9a97b8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  cardHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#8f8cad',
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundImage: `radial-gradient(circle at 35% 30%, #9cc0ff, ${V3.cobalt} 60%)`,
  },
  iconOrchid: {
    backgroundImage: `radial-gradient(circle at 35% 30%, #f6c9fb, ${V3.orchid} 60%)`,
  },
  cardQ: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.3,
    minHeight: 40,
  },
  odds: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  oddsPct: {
    fontSize: 20,
    fontWeight: 600,
  },
  bar: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 5,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(220, 116, 236, 0.38)',
  },
  barFill: {
    display: 'block',
    height: '100%',
    backgroundColor: V3.cobalt,
  },
  yn: {
    display: 'flex',
    gap: 8,
  },
  ynSide: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
    padding: 7,
    borderRadius: 9,
    fontSize: 13,
    fontWeight: 600,
  },
  volume: {
    fontSize: 12,
    color: '#77749a',
  },
});

const width = stylex.create({
  at: (percent: number) => ({ width: `${percent}%` }),
});

/** The mock of the app's home route, drawn at 1180 wide. */
function AppMock() {
  const chart = chartPath();
  const { series, trending } = APP;
  return (
    <div {...stylex.props(ui.root)}>
      <div {...stylex.props(ui.top)}>
        <span {...stylex.props(ui.brand)}>
          <Orbs style={ui.brandMark} />
          <span>
            <b {...stylex.props(ui.brandSols)}>{APP.brand.sols}</b>
            <span {...stylex.props(ui.brandMarket)}>{APP.brand.market}</span>
          </span>
        </span>
        <span {...stylex.props(ui.search)}>{APP.search}</span>
        <span {...stylex.props(ui.nav)}>
          {APP.nav.map((item, index) => (
            <span key={item} {...stylex.props(index === 0 && ui.navOn)}>
              {item}
            </span>
          ))}
        </span>
        <span {...stylex.props(ui.connect)}>{APP.connect}</span>
      </div>
      <div {...stylex.props(ui.body)}>
        <div {...stylex.props(ui.series)}>
          <div>
            <span {...stylex.props(ui.live)}>
              <i {...stylex.props(ui.liveDot)} />
              {series.live}
            </span>
            <h4 {...stylex.props(ui.question)}>{series.question}</h4>
            <p {...stylex.props(ui.meta)}>{series.meta}</p>
            <div {...stylex.props(ui.big)}>
              <span {...stylex.props(ui.bigSide, ui.yes)}>{series.yes}</span>
              <span {...stylex.props(ui.bigSide, ui.no)}>{series.no}</span>
            </div>
          </div>
          <div>
            <div {...stylex.props(ui.pct)}>
              {series.pct}
              <small {...stylex.props(ui.pctSmall)}>{series.chance}</small>
            </div>
            <svg {...stylex.props(ui.chart)} viewBox="0 0 520 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="v3-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1E69F6" stopOpacity=".45" />
                  <stop offset="1" stopColor="#1E69F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="rgba(255,255,255,.06)">
                <path d="M0 37H520M0 75H520M0 112H520" />
              </g>
              <path d={chart.area} fill="url(#v3-chart-fill)" />
              <path
                d={chart.line}
                fill="none"
                stroke="#5b95ff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div {...stylex.props(ui.ranges)}>
              {series.ranges.map((range, index) => (
                <span key={range} {...stylex.props(ui.range, index === series.activeRange && ui.chipOn)}>
                  {range}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div {...stylex.props(ui.trend)}>
          <b {...stylex.props(ui.trendLabel)}>{trending.label}</b>
          {trending.items.map((item) => (
            <span key={item.q} {...stylex.props(ui.trendChip)}>
              {item.q}
              <em {...stylex.props(ui.trendPct)}>{item.p}</em>
            </span>
          ))}
        </div>
        <div {...stylex.props(ui.toolbar)}>
          <div {...stylex.props(ui.tabs)}>
            {APP.tabs.map((tab, index) => (
              <span key={tab} {...stylex.props(ui.tab, index === 0 && ui.chipOn)}>
                {tab}
              </span>
            ))}
          </div>
          <span {...stylex.props(ui.sort)}>{APP.sort}</span>
        </div>
        <div {...stylex.props(ui.grid)}>
          {APP.cards.map((card) => (
            <div key={card.q} {...stylex.props(ui.card)}>
              <div {...stylex.props(ui.cardHead)}>
                <i {...stylex.props(ui.icon, card.orchid && ui.iconOrchid)} />
                {card.desk}
              </div>
              <p {...stylex.props(ui.cardQ)}>{card.q}</p>
              <div {...stylex.props(ui.odds)}>
                <b {...stylex.props(ui.oddsPct)}>{card.pct}%</b>
                <span {...stylex.props(ui.bar)}>
                  <i {...stylex.props(ui.barFill, width.at(card.pct))} />
                </span>
              </div>
              <div {...stylex.props(ui.yn)}>
                <span {...stylex.props(ui.ynSide, ui.yes)}>{APP.yes}</span>
                <span {...stylex.props(ui.ynSide, ui.no)}>{APP.no}</span>
              </div>
              <small {...stylex.props(ui.volume)}>{card.volume}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type AppLabels = {
  title: string;
  sub: string;
  host: string;
  shot: string;
  caption: string;
};

/**
 * The product, in a window that stands up as the page reaches it.
 *
 * The mock inside is drawn at a fixed width and scaled to whatever the window
 * is, so it reads the same on a phone as on a wide screen — smaller, not
 * reflowed.
 */
export function AppStage({ labels }: { labels: AppLabels }) {
  const stageRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = fitRef.current;
    const mock = mockRef.current;
    if (!fit || !mock) return;
    const resize = () => {
      const scale = fit.clientWidth / MOCK_WIDTH;
      mock.style.transform = `scale(${scale})`;
      fit.style.height = `${mock.offsetHeight * scale}px`;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(fit);
    resize();
    return () => observer.disconnect();
  }, []);

  const onFrame = useCallback((reduce: boolean) => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const ap = progress(stage, 1.05, 0.32);
    if (deviceRef.current) {
      deviceRef.current.style.transform = `rotateX(${((1 - ap) * 36).toFixed(2)}deg) scale(${(0.82 + ap * 0.18).toFixed(4)})`;
    }
    if (glowRef.current) glowRef.current.style.opacity = (0.35 + ap * 0.65).toFixed(3);
  }, []);
  useScrollFrame(onFrame);

  return (
    <section id="app" {...stylex.props(styles.app, shared.section)} aria-labelledby="app-title">
      <div {...stylex.props(shared.wrap)}>
        <h2 id="app-title" {...stylex.props(shared.h2)}>
          {labels.title}
        </h2>
        <p {...stylex.props(shared.sub, styles.sub)}>{labels.sub}</p>
      </div>
      <figure ref={stageRef} {...stylex.props(styles.stage)}>
        <div ref={glowRef} {...stylex.props(styles.glow)} aria-hidden="true" />
        <div {...stylex.props(styles.arc)} aria-hidden="true" />
        <div ref={deviceRef} {...stylex.props(styles.device)} role="img" aria-label={labels.shot}>
          <div {...stylex.props(styles.bar)} aria-hidden="true">
            <i {...stylex.props(styles.dot)} />
            <i {...stylex.props(styles.dot)} />
            <i {...stylex.props(styles.dot)} />
            <span {...stylex.props(styles.host)}>{labels.host}</span>
          </div>
          <div ref={fitRef} {...stylex.props(styles.fit)} aria-hidden="true">
            <div ref={mockRef} {...stylex.props(styles.mockWrap)}>
              <AppMock />
            </div>
          </div>
        </div>
        <figcaption {...stylex.props(styles.caption)}>{labels.caption}</figcaption>
      </figure>
    </section>
  );
}
