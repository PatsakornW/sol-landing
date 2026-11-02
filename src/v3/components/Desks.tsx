'use client';

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { asset } from '@/configs/configs';
import { font } from '../../styles/tokens.stylex';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';

const styles = stylex.create({
  desks: {
    paddingBlock: 'clamp(90px, 11vw, 170px)',
  },
  /* A row of six that widens whichever one the pointer is on. On a phone it
     becomes a strip the reader slides, each card already open. */
  row: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    marginTop: 'clamp(50px, 6vw, 84px)',
    display: 'flex',
    gap: 10,
    height: { default: 'clamp(470px, 74vh, 680px)', [bp.max760]: 'auto' },
    overflowX: { default: 'visible', [bp.max760]: 'auto' },
    scrollSnapType: { default: 'none', [bp.max760]: 'x mandatory' },
    paddingBottom: { default: 0, [bp.max760]: 12 },
    marginInline: { default: 0, [bp.max760]: `calc(-1 * ${V3.gutter})` },
    paddingInline: { default: 0, [bp.max760]: V3.gutter },
    scrollbarWidth: { default: 'auto', [bp.max760]: 'none' },
  },
  desk: {
    position: 'relative',
    flexGrow: { default: 1, [bp.max760]: 0 },
    flexShrink: { default: 1, [bp.max760]: 0 },
    flexBasis: { default: 0, [bp.max760]: '76vw' },
    height: { default: 'auto', [bp.max760]: 440 },
    scrollSnapAlign: 'center',
    minWidth: 0,
    borderRadius: 24,
    overflow: 'hidden',
    isolation: 'isolate',
    cursor: 'pointer',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line,
    backgroundColor: '#020207',
    transitionProperty: 'flex-grow, border-color',
    transitionDuration: '0.9s, 0.5s',
    transitionTimingFunction: `${V3.ease}, ease`,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
  deskActive: {
    flexGrow: { default: 3.6, [bp.max760]: 0 },
    borderColor: V3.line2,
  },
  image: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    objectFit: 'cover',
    objectPosition: '50% 22%',
    transitionProperty: 'scale, filter',
    transitionDuration: '1.2s, 0.9s',
    transitionTimingFunction: `${V3.ease}, ease`,
  },
  imageDim: {
    scale: { default: 1.08, [bp.max760]: 1 },
    filter: { default: 'brightness(0.6) saturate(0.75)', [bp.max760]: 'none' },
  },
  wash: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  vertical: {
    position: 'absolute',
    left: '50%',
    bottom: 26,
    translate: '-50% 0',
    writingMode: 'vertical-rl',
    rotate: '180deg',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(24px, 2.3vw, 34px)',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    transitionProperty: 'opacity',
    transitionDuration: '0.45s',
    opacity: { default: 1, [bp.max760]: 0 },
  },
  verticalOff: {
    opacity: 0,
  },
  caption: {
    position: 'absolute',
    left: 'clamp(20px, 2.4vw, 34px)',
    right: 20,
    bottom: 'clamp(22px, 2.4vw, 34px)',
    opacity: { default: 0, [bp.max760]: 1 },
    translate: { default: '0 14px', [bp.max760]: '0 0' },
    transitionProperty: 'opacity, translate',
    transitionDuration: '0.5s, 0.7s',
    transitionTimingFunction: `ease, ${V3.ease}`,
  },
  captionOn: {
    opacity: 1,
    translate: '0 0',
    transitionDelay: '0.25s',
  },
  title: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(40px, 4.6vw, 72px)',
    lineHeight: 0.95,
    letterSpacing: '-0.04em',
  },
  hint: {
    margin: 0,
    marginTop: 10,
    color: '#cfcce6',
    fontSize: 16,
  },
});

const wash = stylex.create({
  tinted: (base: string) => ({
    backgroundImage: `linear-gradient(to bottom, transparent 50%, rgba(2, 2, 7, 0.9)), radial-gradient(90% 55% at 50% 30%, color-mix(in srgb, ${base} 12%, transparent), transparent 70%)`,
  }),
});

export type Desk = { key: string; name: string; hint: string; base: string; image: string };

export type DesksLabels = {
  title: string;
  sub: string;
  desks: readonly Desk[];
};

/** Six desks at launch, each a picture that opens when pointed at. */
export function Desks({ labels }: { labels: DesksLabels }) {
  const [active, setActive] = useState(labels.desks[0]?.key ?? '');

  return (
    <section id="desks" {...stylex.props(styles.desks, shared.section)} aria-labelledby="desks-title">
      <div {...stylex.props(shared.wrap)}>
        <h2 id="desks-title" {...stylex.props(shared.h2)}>
          {labels.title}
        </h2>
        <p {...stylex.props(shared.sub)}>{labels.sub}</p>
        <ul {...stylex.props(styles.row)}>
          {labels.desks.map((desk) => {
            const on = desk.key === active;
            return (
              <li
                key={desk.key}
                {...stylex.props(styles.desk, on && styles.deskActive)}
                tabIndex={0}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setActive(desk.key);
                }}
                onFocus={() => setActive(desk.key)}
                onClick={() => setActive(desk.key)}
              >
                <img
                  {...stylex.props(styles.image, !on && styles.imageDim)}
                  src={asset(desk.image)}
                  alt=""
                  width={688}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
                <span {...stylex.props(styles.wash, wash.tinted(desk.base))} aria-hidden="true" />
                <span {...stylex.props(styles.vertical, on && styles.verticalOff)} aria-hidden="true">
                  {desk.name}
                </span>
                <div {...stylex.props(styles.caption, on && styles.captionOn)}>
                  <h3 {...stylex.props(styles.title)}>{desk.name}</h3>
                  <p {...stylex.props(styles.hint)}>{desk.hint}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
