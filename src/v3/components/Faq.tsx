'use client';

import { useId, useState, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';

const styles = stylex.create({
  faq: {
    paddingBlock: 'clamp(90px, 11vw, 170px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 5fr) minmax(0, 7fr)', [bp.max900]: '1fr' },
    gap: 'clamp(40px, 6vw, 110px)',
  },
  head: {
    position: { default: 'sticky', [bp.max900]: 'static' },
    top: 120,
    alignSelf: 'start',
  },
  headLink: {
    color: V3.star,
    textDecorationLine: 'underline',
    textDecorationColor: { default: 'rgba(255, 227, 179, 0.5)', ':hover': V3.corona },
    textUnderlineOffset: 4,
  },
  item: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: V3.line,
  },
  itemLast: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: V3.line,
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
    paddingBlock: 30,
    paddingInline: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(24px, 2.5vw, 36px)',
    lineHeight: 1.12,
    letterSpacing: '-0.02em',
    color: { default: V3.star, ':hover': '#fff' },
    transitionProperty: 'color',
    transitionDuration: '0.3s',
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
    borderRadius: 6,
  },
  /* A plus that turns into a cross when its answer is open. */
  pm: {
    position: 'relative',
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: '50%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    backgroundColor: 'transparent',
    transitionProperty: 'background-color, border-color, rotate',
    transitionDuration: '0.4s, 0.4s, 0.5s',
    transitionTimingFunction: `ease, ease, ${V3.ease}`,
    '::before': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 14,
      height: 1.5,
      backgroundColor: 'currentColor',
      translate: '-50% -50%',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 14,
      height: 1.5,
      backgroundColor: 'currentColor',
      translate: '-50% -50%',
      rotate: '90deg',
    },
  },
  pmOpen: {
    rotate: '45deg',
    backgroundColor: V3.sun,
    color: V3.ink,
    borderColor: V3.sun,
  },
  panel: {
    display: 'grid',
    gridTemplateRows: '0fr',
    transitionProperty: 'grid-template-rows',
    transitionDuration: '0.55s',
    transitionTimingFunction: V3.ease,
  },
  panelOpen: {
    gridTemplateRows: '1fr',
  },
  panelInner: {
    overflow: 'hidden',
    minHeight: 0,
  },
  answer: {
    margin: 0,
    paddingRight: { default: 56, [bp.max900]: 0 },
    paddingBottom: 32,
    color: V3.dust,
    fontSize: 18,
    lineHeight: 1.6,
    maxWidth: '56ch',
  },
});

export type FaqItem = { id: string; term: string; definition: string };

export type FaqLabels = {
  title: string;
  /** The line under the head, which carries a link to the docs. */
  sub: ReactNode;
  items: readonly FaqItem[];
};

/** The short answers, one open at a time. */
export function Faq({ labels }: { labels: FaqLabels }) {
  const uid = useId();
  const [open, setOpen] = useState(labels.items[0]?.id ?? null);

  return (
    <section id="faq" {...stylex.props(styles.faq, shared.section)} aria-labelledby="faq-title">
      <div {...stylex.props(shared.wrap, styles.grid)}>
        <div {...stylex.props(styles.head)}>
          <h2 id="faq-title" {...stylex.props(shared.h2)}>
            {labels.title}
          </h2>
          <p {...stylex.props(shared.sub)}>{labels.sub}</p>
        </div>
        <div>
          {labels.items.map((item, index) => {
            const on = open === item.id;
            const buttonId = `${uid}-${item.id}-q`;
            const panelId = `${uid}-${item.id}-a`;
            return (
              <div
                key={item.id}
                {...stylex.props(styles.item, index === labels.items.length - 1 && styles.itemLast)}
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    id={buttonId}
                    {...stylex.props(styles.summary)}
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setOpen(on ? null : item.id)}
                  >
                    {item.term}
                    <span {...stylex.props(styles.pm, on && styles.pmOpen)} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  {...stylex.props(styles.panel, on && styles.panelOpen)}
                >
                  <div {...stylex.props(styles.panelInner)}>
                    <p {...stylex.props(styles.answer)}>{item.definition}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** The docs link the FAQ head points at. */
export function FaqLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} {...stylex.props(styles.headLink)} target="_blank" rel="noopener">
      {children}
    </a>
  );
}
