'use client';

import type { ComponentProps, ReactNode } from 'react';
import { translations } from '@/v5/i18n/messages';
import {
  HugeiconsIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BarChartIcon,
  CheckIcon,
  CoinsIcon,
  HourglassIcon,
  LightbulbIcon,
  ScaleIcon,
  TrophyIcon,
  UsersIcon,
} from '@/v5/lib/icons';

type Icon = ComponentProps<typeof HugeiconsIcon>['icon'];

type Tone = 'crypto' | 'politics' | 'sports' | 'culture' | 'tech' | 'economy';

const TONE_ICON: Record<Tone, Icon> = {
  crypto: CoinsIcon,
  politics: ScaleIcon,
  sports: TrophyIcon,
  culture: UsersIcon,
  tech: LightbulbIcon,
  economy: BarChartIcon,
};

/**
 * The fan's cards. Each one is a card the web app renders on its market grid
 * (apps/web/src/components/markets/insight-card), and nothing else:
 *
 * - `series`: SeriesInsightCard while its window is live.
 * - `cover`: EventGroupInsightCard's headline cover with its ChanceMeter.
 * - `binary`: the default binary card (chance line, Yes/No pair).
 * - `multi`: a group's outcome rows with compact Yes/No buttons.
 * - `awaiting` / `resolved`: a binary card after close and after resolution.
 *
 * All figures are samples. `image` is the slot for real artwork: null renders
 * a tinted placeholder in the category's colour; a URL renders the picture.
 */
export const FAN_CARDS = [
  { id: 'sol', variant: 'series', tone: 'crypto', image: null, yes: 52, seed: 17, vol: 84_200 },
  { id: 'turnout', variant: 'cover', tone: 'politics', image: null, yes: 58, seed: 5, vol: 0 },
  { id: 'final', variant: 'awaiting', tone: 'sports', image: null, yes: 54, seed: 9, vol: 312_400 },
  {
    id: 'btc',
    variant: 'binary',
    tone: 'crypto',
    image: null,
    yes: 62,
    seed: 7,
    vol: 1_240_000,
    move: 3,
  },
  { id: 'fed', variant: 'multi', tone: 'economy', image: null, yes: 41, seed: 3, vol: 2_810_000 },
  {
    id: 'ai',
    variant: 'binary',
    tone: 'tech',
    image: null,
    yes: 31,
    seed: 21,
    vol: 486_000,
    move: -2,
  },
  {
    id: 'film',
    variant: 'resolved',
    tone: 'culture',
    image: null,
    yes: 100,
    seed: 13,
    vol: 97_300,
  },
] as const satisfies readonly {
  id: string;
  variant: 'series' | 'cover' | 'binary' | 'multi' | 'awaiting' | 'resolved';
  tone: Tone;
  image: string | null;
  yes: number;
  seed: number;
  vol: number;
  /** Binary cards: the sample 1D move in points. */
  move?: number;
}[];

export type FanCardData = (typeof FAN_CARDS)[number];

/** A small deterministic wobble so idle prices move without randomness drift. */
function wobble(seed: number, tick: number, range: number): number {
  const a = Math.sin(seed * 12.9898 + tick * 0.71) * 0.6 + Math.sin(seed * 3.1 + tick * 0.23) * 0.4;
  return Math.round(a * range);
}

function money(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  return `$${(usd / 1000).toFixed(1)}K`;
}

/** Image slot: real artwork when a URL is set, otherwise a category-tinted placeholder. */
function CardImage({
  tone,
  image,
  className,
  children,
}: {
  tone: Tone;
  image: string | null;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={`ph${className ? ` ${className}` : ''}`} data-tone={tone}>
      {image ? (
        <img src={image} alt="" className="ph__img" />
      ) : (
        <HugeiconsIcon className="ph__icon" icon={TONE_ICON[tone]} size={20} strokeWidth={1.6} />
      )}
      {children}
    </span>
  );
}

/** A number that flashes when its value changes (the key restarts the animation). */
function Num({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  return (
    <span className="num" key={String(value)}>
      {value}
      {suffix}
    </span>
  );
}

/** cardShell header: thumb + clamped title. */
function Header({ card, title }: { card: FanCardData; title: string }) {
  return (
    <div className="fcard__head">
      <CardImage tone={card.tone} image={card.image} className="ph--thumb" />
      <p className="fcard__title">{title}</p>
    </div>
  );
}

/** ChanceLine: bold percent, caption, and the optional 1D move. */
function ChanceLine({ pct, caption, move }: { pct: number; caption: string; move?: number }) {
  return (
    <div className="fcard__chance">
      <span className="fcard__pct">
        <Num value={pct} suffix="%" />
      </span>
      <span className="fcard__caption">{caption}</span>
      {move ? (
        <span className={`fcard__move fcard__move--${move > 0 ? 'up' : 'down'}`}>
          <HugeiconsIcon
            icon={move > 0 ? ArrowUpIcon : ArrowDownIcon}
            size={12}
            strokeWidth={2.25}
          />
          {Math.abs(move)}
        </span>
      ) : null}
    </div>
  );
}

/** OutcomeButtons `binary`: the wide Yes/No pair. */
function WideButtons({ yes, no }: { yes: string; no: string }) {
  return (
    <div className="fcard__pair">
      <span className="fbtn fbtn--wide fbtn--yes">{yes}</span>
      <span className="fbtn fbtn--wide fbtn--no">{no}</span>
    </div>
  );
}

/** The ended state: one pill with a coloured badge and its label. */
function Result({ kind, label }: { kind: 'pending' | 'yes'; label: string }) {
  return (
    <div className="fcard__result">
      <span className={`fcard__badge fcard__badge--${kind}`}>
        <HugeiconsIcon
          icon={kind === 'pending' ? HourglassIcon : CheckIcon}
          size={14}
          strokeWidth={2.5}
        />
      </span>
      <span className="fcard__result-label">{label}</span>
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="fcard__foot">{children}</div>;
}

function Volume({ usd }: { usd: number }) {
  const t = translations('fan');
  return (
    <span>
      {money(usd)} {t('vol')}
    </span>
  );
}

export function FanCardBody({ card, tick }: { card: FanCardData; tick: number }) {
  const t = translations('fan');
  const td = translations('demo');
  const tc = translations('categories');
  const price = Math.min(97, Math.max(3, card.yes + wobble(card.seed, tick, 3)));
  // Volume only grows while the fan runs.
  const vol = card.vol + tick * ((card.seed % 5) + 1) * 37;

  switch (card.variant) {
    case 'series':
      return (
        <>
          <Header card={card} title={t('sol.q')} />
          <div className="fcard__body">
            <ChanceLine pct={price} caption={t('sol.up')} />
            <WideButtons yes={t('sol.up')} no={t('sol.down')} />
          </div>
          <Footer>
            <span className="fcard__live">
              <i aria-hidden="true" />
              {t('live')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="fcard__asset">SOL</span>
            <span aria-hidden="true">·</span>
            <Volume usd={vol} />
          </Footer>
        </>
      );
    case 'cover':
      return (
        <div className="fcard__cover">
          <CardImage tone={card.tone} image={card.image} className="ph--cover" />
          <span className="fcard__scrim" aria-hidden="true" />
          <span className="fcard__meter">
            <b>
              <Num value={price} suffix="%" />
            </b>
            <span className="fcard__meter-bar">
              <i style={{ width: `${price}%` }} />
            </span>
          </span>
          <span className="fcard__masthead">
            <span className="fcard__kicker">{tc(`${card.tone}.name`)}</span>
            <span className="fcard__cover-title">{t('turnout.q')}</span>
          </span>
        </div>
      );
    case 'binary': {
      // The 1D move: the card's sample move, nudged now and then.
      const move = card.move + wobble(card.seed + 1, Math.floor(tick / 6), 1) || card.move;
      return (
        <>
          <Header card={card} title={t(`${card.id}.q`)} />
          <div className="fcard__body">
            <ChanceLine pct={price} caption={t('chance')} move={move === 0 ? 1 : move} />
            <WideButtons yes={td('yes')} no={td('no')} />
          </div>
          <Footer>
            <Volume usd={vol} />
            <span aria-hidden="true">·</span>
            <span>{t(`${card.id}.end`)}</span>
          </Footer>
        </>
      );
    }
    case 'multi': {
      const a = 22 + wobble(card.seed, tick, 3);
      const b = 41 + wobble(card.seed + 2, tick, 3);
      // Listed by chance, as the app ranks rows; the order stays fixed while the
      // prices tick, so rows never swap places mid-animation.
      const rows = [
        { key: 'o2', pct: b, slot: 0 },
        { key: 'o3', pct: 100 - a - b, slot: 1 },
        { key: 'o1', pct: a, slot: 2 },
      ];
      return (
        <>
          <Header card={card} title={t('fed.q')} />
          <div className="fcard__rows">
            {rows.map((o) => {
              const name = t(`fed.${o.key}`);
              return (
                <div className="fcard__row" key={o.key}>
                  <span className="fcard__avatar" data-slot={o.slot}>
                    {name.charAt(0)}
                  </span>
                  <span className="fcard__oname">{name}</span>
                  <span className="fcard__opct">
                    <Num value={o.pct} suffix="%" />
                  </span>
                  <span className="fbtn fbtn--compact fbtn--yes">{td('yes')}</span>
                  <span className="fbtn fbtn--compact fbtn--no">{td('no')}</span>
                </div>
              );
            })}
          </div>
          <Footer>
            <Volume usd={vol} />
            <span aria-hidden="true">·</span>
            <span>{t('fed.end')}</span>
          </Footer>
        </>
      );
    }
    case 'awaiting':
      return (
        <>
          <Header card={card} title={t('final.q')} />
          <div className="fcard__body">
            <ChanceLine pct={card.yes} caption={t('chance')} />
            <Result kind="pending" label={t('awaiting')} />
          </div>
          <Footer>
            <Volume usd={card.vol} />
          </Footer>
        </>
      );
    case 'resolved':
      return (
        <>
          <Header card={card} title={t('film.q')} />
          <div className="fcard__body">
            <Result kind="yes" label={td('yes')} />
          </div>
          <Footer>
            <Volume usd={card.vol} />
          </Footer>
        </>
      );
  }
}
