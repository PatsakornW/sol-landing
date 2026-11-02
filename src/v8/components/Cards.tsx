'use client';

import { useRef, type ReactNode } from 'react';
import { BrandMark } from '../brand';
import { t8 } from '../i18n/messages';
import { Ball, Ballot, Bitcoin } from './Icons';

export const CARD_DESKS = ['crypto', 'politics', 'sports'] as const;
type CardDesk = (typeof CARD_DESKS)[number];

const ICONS: Record<CardDesk, () => ReactNode> = {
  crypto: Bitcoin,
  politics: Ballot,
  sports: Ball,
};

/** The fan's resting angle for each card, in degrees. */
const TILT: Record<CardDesk, number> = { crypto: -22, politics: 0, sports: 22 };

/**
 * A desk card, playing-card style: the desk's name in one corner and its
 * icon in the other, the question in the middle, and the corners repeated
 * upside down below. On the stage the fan can be dragged about and springs
 * back on release; on a phone the same fan comes in smaller.
 */
function Card({ desk }: { desk: CardDesk }) {
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const Icon = ICONS[desk];

  return (
    <div className={`card card--${desk}`} style={{ ['--tilt' as string]: `${TILT[desk]}deg` }}>
      <div
        className="card__face"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !document.documentElement.classList.contains('is-stage')) return;
          drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.classList.add('is-dragging');
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          e.currentTarget.style.translate = `${e.clientX - d.x}px ${e.clientY - d.y}px`;
        }}
        onPointerUp={(e) => {
          drag.current = null;
          e.currentTarget.classList.remove('is-dragging');
          e.currentTarget.style.translate = '';
        }}
        onPointerCancel={(e) => {
          drag.current = null;
          e.currentTarget.classList.remove('is-dragging');
          e.currentTarget.style.translate = '';
        }}
      >
        <span className="card__name">{t8(`markets.cards.${desk}.name`)}</span>
        <span className="card__icon">
          <Icon />
        </span>
        <p className="card__q">{t8(`markets.cards.${desk}.q`)}</p>
        <span className="card__mark" aria-hidden="true">
          <BrandMark />
        </span>
        <span className="card__name card__name--flip" aria-hidden="true">
          {t8(`markets.cards.${desk}.name`)}
        </span>
      </div>
    </div>
  );
}

export function Cards() {
  return (
    <div className="cards">
      {CARD_DESKS.map((d) => (
        <Card key={d} desk={d} />
      ))}
    </div>
  );
}
