import { asset } from '@/configs/configs';

/**
 * The page's 3D pieces: candy-plastic renders made in three.js and exported
 * as transparent WebP into `public/v6/`. Each is a square at 1024px.
 */
export const ICONS = [
  'yes', 'no', 'usdc', 'sol', 'btc', 'question', 'up', 'bolt', 'vault', 'key', 'gavel',
  'ballot', 'ball', 'tag', 'bank', 'barrel', 'gold', 'chip', 'bell', 'clapper', 'sun',
] as const;

export type IconName = (typeof ICONS)[number];

export function icon(name: IconName): string {
  return asset(`/v6/${name}.webp`);
}
