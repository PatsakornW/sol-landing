import { AppConfig, asset } from '@/configs/configs';

/** The six desks, in the order every list on the page uses. */
export const DESKS = ['crypto', 'politics', 'sports', 'culture', 'tech', 'economy'] as const;
export type Desk = (typeof DESKS)[number];

/** The community group the waitlist sends people to once they have signed up. */
export const TELEGRAM_URL = AppConfig.social.telegram.url;

/** A 3D icon: the transparent renders made for V6, in `public/v6/`. */
export function icon3d(name: string): string {
  return asset(`/v6/${name}.webp`);
}

/** Each desk's 3D icon. */
export const DESK_ICONS: Record<Desk, string> = {
  crypto: 'btc',
  politics: 'ballot',
  sports: 'ball',
  culture: 'clapper',
  tech: 'chip',
  economy: 'bank',
};

/** The four platform claims, each with the 3D icon shown while it is active. */
export const FEATURES = [
  { key: 'onchain', icon: 'usdc' },
  { key: 'instant', icon: 'bolt' },
  { key: 'noncustodial', icon: 'key' },
  { key: 'oracle', icon: 'gavel' },
] as const;

export const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;
