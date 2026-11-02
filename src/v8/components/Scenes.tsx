import { BrandMark } from '../brand';
import { t8 } from '../i18n/messages';
import { Check } from './Icons';

/** The Yes price the price card settles on, in cents. Illustrative. */
export const PRICE = 62;

/**
 * Paint the price card at a Yes price of `v` cents: the big figure, the
 * chance, the No price and the bar. The stage timeline calls this as it
 * counts up; the markup is rendered at the final price.
 */
export function paintPrice(root: ParentNode, v: number) {
  const n = Math.round(v);
  root.querySelectorAll<HTMLElement>('[data-price]').forEach((el) => {
    el.style.setProperty('--v', String(v));
  });
  root.querySelectorAll<HTMLElement>('[data-yes]').forEach((el) => (el.textContent = String(n)));
  root.querySelectorAll<HTMLElement>('[data-no]').forEach((el) => (el.textContent = String(100 - n)));
}

/**
 * The price card: a Yes share's price, which is also its chance, on a bar
 * from 0 to 1 USDC — the Yes part in blue, the No part in pink, the two always
 * adding up to one dollar.
 */
export function PriceCard() {
  return (
    <div className="price" data-price style={{ ['--v' as string]: String(PRICE) }} aria-hidden="true">
      <div className="price__head">
        <span className="price__tag">{t8('price.label')}</span>
        <span className="price__q">{t8('price.question')}</span>
      </div>
      <div className="price__figure">
        <b>
          <span data-yes>{PRICE}</span>
          <small>¢</small>
        </b>
        <span className="price__eq">=</span>
        <b className="price__chance">
          <span data-yes>{PRICE}</span>
          <small>%</small>
          <em>{t8('price.chance')}</em>
        </b>
      </div>
      <div className="price__bar">
        <i className="price__fill" />
        <i className="price__knob" />
      </div>
      <div className="price__scale">
        <span>{t8('price.min')}</span>
        <span>0.25</span>
        <span>0.50</span>
        <span>0.75</span>
        <span>{t8('price.max')}</span>
      </div>
      <div className="price__legs">
        <span className="price__leg price__leg--yes">
          {t8('price.yes')} <span data-yes>{PRICE}</span>¢
        </span>
        <span className="price__plus">+</span>
        <span className="price__leg price__leg--no">
          {t8('price.no')} <span data-no>{100 - PRICE}</span>¢
        </span>
        <span className="price__sum">{t8('price.sum')}</span>
      </div>
    </div>
  );
}

const ASKS = [0.42, 0.66, 0.5];
const BIDS = [0.72, 0.55, 0.36];

/**
 * Off-chain into on-chain: the order book, where a Yes buyer at 62¢ and a No
 * buyer at 38¢ meet and match; a wire to Solana, where the matched trade lands
 * as the newest batch on the stack, settled against the market's USDC vault.
 */
export function Flow() {
  return (
    <div className="flow rv" aria-hidden="true">
      <div className="flow__panel flow__panel--off">
        <p className="flow__head">
          <b>{t8('flow.off')}</b>
          <span>{t8('flow.offSub')}</span>
        </p>
        <div className="flow__book">
          {ASKS.map((d, i) => (
            <p key={`a${i}`} className="flow__lvl flow__lvl--ask">
              <span>{40 - i}¢</span>
              <i style={{ width: `${d * 100}%` }} />
            </p>
          ))}
          <div className="flow__spread">
            <span className="flow__chip flow__chip--bid">{t8('flow.bid')}</span>
            <span className="flow__chip flow__chip--ask">{t8('flow.ask')}</span>
            <span className="flow__match">
              <Check />
              {t8('flow.match')}
            </span>
          </div>
          {BIDS.map((d, i) => (
            <p key={`b${i}`} className="flow__lvl flow__lvl--bid">
              <span>{62 - i}¢</span>
              <i style={{ width: `${d * 100}%` }} />
            </p>
          ))}
        </div>
      </div>
      <div className="flow__wire">
        <i className="flow__pulse" />
      </div>
      <div className="flow__panel flow__panel--on">
        <p className="flow__head">
          <b>{t8('flow.on')}</b>
          <span>{t8('flow.onSub')}</span>
        </p>
        <div className="flow__chain">
          <p className="flow__block flow__block--new">
            <span>
              {t8('flow.batch')} #4182
            </span>
            <span className="flow__done">
              <Check />
              {t8('flow.settled')}
            </span>
          </p>
          {[4181, 4180, 4179].map((n) => (
            <p key={n} className="flow__block">
              <span>
                {t8('flow.batch')} #{n}
              </span>
              <span className="flow__done">
                <Check />
              </span>
            </p>
          ))}
        </div>
        <p className="flow__vault">
          <span className="flow__mark">
            <BrandMark />
          </span>
          {t8('flow.vault')}
        </p>
      </div>
    </div>
  );
}

/**
 * The pair: a Yes coin in the mark's pink stripes and a No coin in its blue,
 * which slide together into the mark itself — one Yes and one No, backed by
 * one USDC.
 */
export function Pair() {
  return (
    <div className="pair rv" aria-hidden="true">
      <span className="pair__coin pair__coin--yes">
        <span>{t8('vault.yes')}</span>
      </span>
      <span className="pair__coin pair__coin--no">
        <span>{t8('vault.no')}</span>
      </span>
      <span className="pair__sum">{t8('vault.pair')}</span>
    </div>
  );
}
