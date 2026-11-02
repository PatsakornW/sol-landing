'use client';

import { t7 } from '../i18n/messages';
import { DESKS, type Desk } from '../lib/content';
import { pad } from '../lib/motion';

/**
 * The card that slides over the film: the waitlist line, a chip for each desk
 * to pick, a counter of picks beside the line, and the button that opens the
 * waitlist sheet. Behind it, soft colour drifts as if out of focus.
 */
export function Talk({ picked, onToggle, onJoin }: { picked: Desk[]; onToggle: (desk: Desk) => void; onJoin: () => void }) {
  return (
    <section className="card talk" id="waitlist" data-nav="dark">
      <div className="talk__blur" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="talk__inner">
        <h2 className="talk__title rv">
          {t7('cta.title')}
          <span className="badge" aria-label={`${picked.length} ${t7('talk.picked')}`}>
            {pad(picked.length)}
          </span>
        </h2>
        <p className="sr-only">{t7('talk.hint')}</p>
        <ul className="chips rv">
          {DESKS.map((k) => {
            const on = picked.includes(k);
            const name = t7(`categories.${k}.name`);
            return (
              <li key={k}>
                <button type="button" className={`chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => onToggle(k)}>
                  <span className="roll">
                    <span>{name}</span>
                    <span aria-hidden="true">{name}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="pill pill--accent rv" onClick={onJoin} aria-haspopup="dialog">
          {t7('waitlist.button')}
        </button>
      </div>
    </section>
  );
}
