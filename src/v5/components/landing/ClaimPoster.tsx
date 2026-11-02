'use client';

import { m as motion, type MotionStyle, type MotionValue } from 'motion/react';
import { HugeiconsIcon, ArrowRightIcon } from '@/v5/lib/icons';

export type ClaimFact = { label: string; value: string };

/**
 * A plain poster for one platform claim: a full-bleed blurred picture and one
 * large word, then the explanation at the bottom: a label, the title, one
 * sentence and a button, with up to three short facts beside them (the stack
 * passes those; the small grid cards show only the title and button).
 *
 * `image` is the slot for real artwork. Until one is set, `art` picks a
 * generated placeholder in the claim's palette (`.poster__art` in _home.scss).
 *
 * ClaimStack drives the motion props; the static grid passes none.
 */
export function ClaimPoster({
  art,
  image = null,
  href,
  mark,
  title,
  label,
  desc,
  facts,
  action,
  style,
  mediaStyle,
  shade,
  settled = true,
  inert = false,
}: {
  art: string;
  image?: string | null;
  href: string;
  mark: string;
  title: string;
  /** Small label over the title, e.g. "Settlement". */
  label?: string;
  /** Shown under the title (the stack); the grid prints it below the card. */
  desc?: string;
  facts?: ClaimFact[];
  action: string;
  style?: MotionStyle;
  mediaStyle?: MotionStyle;
  /** 0–1: how far the card has sunk under the next one. */
  shade?: MotionValue<number>;
  /** False while the card is still sliding in: its title waits. */
  settled?: boolean;
  /** Out of the stack's view, so out of the tab order too. */
  inert?: boolean;
}) {
  return (
    <motion.article
      className="poster"
      data-art={art}
      data-settled={settled}
      style={style}
      inert={inert || undefined}
    >
      <motion.span className="poster__media" aria-hidden="true" style={mediaStyle}>
        {image ? (
          <img src={image} alt="" className="poster__img" />
        ) : (
          <span className="poster__art">
            <i />
            <i />
            <i />
          </span>
        )}
        <span className="poster__grain" />
      </motion.span>

      <span className="poster__mark" aria-hidden="true">
        {mark}
      </span>

      <div className="poster__foot">
        <div className="poster__text">
          {label ? <p className="poster__label">{label}</p> : null}
          <h3 className="poster__title">{title}</h3>
          {desc ? <p className="poster__desc">{desc}</p> : null}
          <a href={href} className="poster__cta">
            {action}
            <HugeiconsIcon icon={ArrowRightIcon} size={14} strokeWidth={2.2} />
          </a>
        </div>
        {facts?.length ? (
          <dl className="poster__facts">
            {facts.map((f) => (
              <div className="poster__fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {shade ? (
        <motion.span className="poster__shade" aria-hidden="true" style={{ opacity: shade }} />
      ) : null}
    </motion.article>
  );
}
