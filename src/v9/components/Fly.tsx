import { asset } from '@/configs/configs';
import { t9 } from '../i18n/messages';

/** A transparent 3D render from V6, in `public/v6/`. */
export const icon3d = (name: string) => asset(`/v6/${name}.webp`);

type Desk = 'crypto' | 'politics' | 'sports' | 'culture' | 'tech' | 'economy';

/**
 * One piece that flies out of a scene: a 3D render or a market card. `x` and
 * `y` are where it passes through, as a share of half the screen from the
 * middle; `size` is in vmin; `at` staggers it along the scene's flight.
 */
export type FlyItem = { icon?: string; desk?: Desk; yes?: number; tint?: 'blue' | 'pink' | 'violet' | 'cream'; x: number; y: number; size: number; rot: number; at: number };

/** A market as a rounded card: the desk, the question, the chance and its bar. Illustrative. */
function Tile({ desk, yes = 50, tint = 'cream' }: { desk: Desk; yes?: number; tint?: FlyItem['tint'] }) {
  return (
    <span className={`tile tile--${tint}`}>
      <span className="tile__top">
        <img src={icon3d(DESK_ICON[desk])} alt="" className="tile__icon" />
        <span className="tile__desk">{t9(`sheets.markets.names.${desk}`)}</span>
        <span className="tile__live">{t9('tiles.live')}</span>
      </span>
      <span className="tile__q">{t9(`sheets.markets.q.${desk}`)}</span>
      <span className="tile__chance">
        <b>{yes}%</b> {t9('tiles.chance')}
      </span>
      <span className="tile__bar">
        <i style={{ width: `${yes}%` }} />
      </span>
      <span className="tile__buy">
        <span>
          {t9('tiles.yes')} {yes}¢
        </span>
        <span>
          {t9('tiles.no')} {100 - yes}¢
        </span>
      </span>
    </span>
  );
}

export const DESK_ICON: Record<Desk, string> = {
  crypto: 'btc',
  politics: 'ballot',
  sports: 'ball',
  culture: 'clapper',
  tech: 'chip',
  economy: 'bank',
};

/** The pieces of one scene's flight, laid out around the middle of the screen. */
export function Fly({ items, className = '' }: { items: FlyItem[]; className?: string }) {
  return (
    <div className={`fly ${className}`} aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className={it.desk ? 'fly__item fly__item--tile' : 'fly__item'}
          data-x={it.x}
          data-y={it.y}
          data-rot={it.rot}
          data-at={it.at}
          style={{ ['--size' as string]: `${it.size}vmin` }}
        >
          {it.desk ? <Tile desk={it.desk} yes={it.yes} tint={it.tint} /> : <img src={icon3d(it.icon!)} alt="" />}
        </span>
      ))}
    </div>
  );
}

/* What flies out of each scene. Cards stand where the reference shows photos. */
export const PRICE_FLY: FlyItem[] = [
  { desk: 'crypto', yes: 62, tint: 'cream', x: -0.62, y: -0.5, size: 22, rot: -6, at: 0 },
  { icon: 'usdc', x: 0.2, y: -0.72, size: 14, rot: 20, at: 0.05 },
  { desk: 'politics', yes: 58, tint: 'blue', x: 0.66, y: -0.28, size: 26, rot: 5, at: 0.1 },
  { icon: 'question', x: -0.3, y: -0.12, size: 11, rot: -15, at: 0.15 },
  { desk: 'sports', yes: 54, tint: 'violet', x: -0.7, y: 0.36, size: 20, rot: 4, at: 0.2 },
  { icon: 'gold', x: 0.82, y: 0.62, size: 19, rot: -20, at: 0.25 },
  { icon: 'yes', x: 0.3, y: 0.22, size: 13, rot: 10, at: 0.3 },
  { desk: 'culture', yes: 47, tint: 'pink', x: 0.12, y: 0.66, size: 22, rot: -4, at: 0.35 },
  { icon: 'sol', x: -0.18, y: 0.84, size: 14, rot: 30, at: 0.4 },
  { icon: 'no', x: -0.9, y: -0.86, size: 13, rot: -25, at: 0.45 },
];

export const BOOK_FLY: FlyItem[] = [
  { desk: 'tech', yes: 41, tint: 'pink', x: -0.24, y: -0.66, size: 22, rot: -5, at: 0 },
  { icon: 'question', x: 0.5, y: -0.6, size: 13, rot: 18, at: 0.05 },
  { desk: 'economy', yes: 36, tint: 'cream', x: 0.62, y: -0.06, size: 20, rot: 6, at: 0.1 },
  { icon: 'usdc', x: -0.6, y: -0.2, size: 16, rot: -18, at: 0.15 },
  { desk: 'crypto', yes: 62, tint: 'violet', x: -0.68, y: 0.5, size: 24, rot: 3, at: 0.2 },
  { icon: 'vault', x: 0.26, y: 0.4, size: 19, rot: -10, at: 0.25 },
  { desk: 'politics', yes: 58, tint: 'cream', x: 0.74, y: 0.72, size: 22, rot: -6, at: 0.3 },
  { icon: 'sol', x: -0.1, y: 0.9, size: 22, rot: 14, at: 0.35 },
  { icon: 'key', x: 0.92, y: -0.82, size: 14, rot: 25, at: 0.4 },
];

export const EVENTS_FLY: FlyItem[] = [
  { icon: 'ballot', x: -0.18, y: -0.7, size: 34, rot: -8, at: 0 },
  { icon: 'btc', x: 0.5, y: -0.42, size: 42, rot: 12, at: 0.06 },
  { icon: 'ball', x: -0.66, y: -0.26, size: 27, rot: -14, at: 0.12 },
  { icon: 'clapper', x: 0.66, y: 0.2, size: 46, rot: 8, at: 0.18 },
  { icon: 'chip', x: -0.46, y: 0.52, size: 38, rot: -6, at: 0.24 },
  { icon: 'bank', x: 0.22, y: 0.72, size: 32, rot: 10, at: 0.3 },
  { icon: 'question', x: 0.84, y: -0.84, size: 19, rot: 20, at: 0.36 },
  { icon: 'gold', x: -0.86, y: 0.86, size: 27, rot: -24, at: 0.42 },
];
