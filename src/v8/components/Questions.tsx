import type { ReactNode } from 'react';
import { t8 } from '../i18n/messages';
import { Ballot, Burst, Gift, Sparkle, Tiles, Wallet } from './Icons';

const ITEMS: { key: string; icon: () => ReactNode }[] = [
  { key: 'q1', icon: Burst },
  { key: 'q2', icon: Sparkle },
  { key: 'q3', icon: Gift },
  { key: 'q4', icon: Wallet },
  { key: 'q5', icon: Ballot },
  { key: 'q6', icon: Tiles },
];

/**
 * All six questions as a stack of cards — a number and an icon, the question
 * and its answer. On the stage one card shows at a time and each step of the
 * scroll lays the next one over it; stacked, the cards stick under the header
 * one on top of another as the page scrolls past them.
 */
export function Questions({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="qs">
      <ol className="qs__tiles">
        {ITEMS.map(({ key, icon: Icon }, i) => (
          <li key={key} className="qs__tile" style={{ ['--i' as string]: i }}>
            <div className="qs__top" aria-hidden="true">
              <span className="qs__num">[{String(i + 1).padStart(2, '0')}]</span>
              <span className="qs__icon">
                <Icon />
              </span>
            </div>
            <h3>{t8(`faq.items.${key}.q`)}</h3>
            <p>{t8(`faq.items.${key}.a`)}</p>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--line qs__cta" onClick={onJoin} aria-haspopup="dialog">
        {t8('faq.cta')}
      </button>
    </div>
  );
}
