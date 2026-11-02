'use client';

import { useState } from 'react';
import { t7 } from '../i18n/messages';
import { DESK_ICONS, DESKS, icon3d, type Desk } from '../lib/content';
import { finePointer } from '../lib/motion';
import { ArrowRight } from './Icons';

/**
 * The six desks as a big centred list. With a mouse, the row under the pointer
 * turns into a black band across the page and the others fade back; the desk's
 * 3D icon opens in a pill right before the name, so icon, name and arrow stay
 * centred together. On touch screens each row carries its icon throughout.
 * Choosing a desk picks it for the waitlist and opens the waitlist sheet.
 */
export function Markets({ onPick }: { onPick: (desk: Desk) => void }) {
  const [hover, setHover] = useState(-1);

  return (
    <section className="markets" id="markets" data-nav="light">
      <div className="markets__head rv">
        <p className="eyebrow">{t7('categories.eyebrow')}</p>
        <p className="markets__lead">{t7('categories.subtitle')}</p>
      </div>
      <div className={`markets__wrap${hover >= 0 ? ' has-hover' : ''}`} onPointerLeave={() => setHover(-1)}>
        <ul className="markets__list">
          {DESKS.map((k, i) => (
            <li key={k} className={hover === i ? 'is-on' : undefined}>
              <button type="button" className="markets__row" onPointerEnter={() => finePointer() && setHover(i)} onClick={() => onPick(k)}>
                <span className="markets__icon">
                  <img src={icon3d(DESK_ICONS[k])} alt="" loading="lazy" />
                </span>
                <span className="markets__name">{t7(`categories.${k}.name`)}</span>
                <span className="markets__go">
                  <ArrowRight />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
