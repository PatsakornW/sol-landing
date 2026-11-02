import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { font } from '../../styles/tokens.stylex';

/** The one place the name lives on this page. */
export const BRAND = { name: AppConfig.name } as const;

const styles = stylex.create({
  mark: { display: 'block', flexShrink: 0 },
  word: {
    fontFamily: font.display,
    fontSize: 'inherit',
    lineHeight: 1,
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
});

const GAPS = [18, 25, 32, 39, 46] as const;

/**
 * The mark in its 64×64 box: a striped purple orb behind a solid blue one.
 * `ink` paints both orbs in one colour, for the places the page is already
 * loud.
 */
export function Mark({ size = 28, ink, style }: { size?: number; ink?: string; style?: stylex.StyleXStyles }) {
  const back = ink ?? '#DC74EC';
  const front = ink ?? '#1E69F6';
  const id = `v6-mark-${ink ? 'ink' : 'colour'}`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" {...stylex.props(styles.mark, style)}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <circle cx="23" cy="32" r="19" fill="#fff" />
          {GAPS.map((y) => (
            <rect key={y} x="4" y={y} width="38" height="2.25" fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="23" cy="32" r="19" fill={back} mask={`url(#${id})`} />
      <circle cx="41" cy="32" r="19" fill={front} />
    </svg>
  );
}

export function Wordmark({ style }: { style?: stylex.StyleXStyles }) {
  return <span {...stylex.props(styles.word, style)}>{BRAND.name}</span>;
}
