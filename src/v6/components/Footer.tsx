import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { font } from '../../styles/tokens.stylex';
import { bp, C } from '../styles/candy.stylex';
import { Mark, Wordmark } from './Brand';

const styles = stylex.create({
  /* The bottom padding leaves room for the corner switch, which is fixed over
     the page and would otherwise sit on the last row. */
  foot: { position: 'relative', zIndex: 1, backgroundColor: C.plate, paddingTop: 14, paddingInline: 14, paddingBottom: { default: 84, [bp.max560]: 78 } },
  card: {
    borderRadius: 22,
    backgroundColor: C.baseDeep,
    color: C.type,
    paddingTop: 'clamp(36px, 7vh, 72px)',
    paddingBottom: 'clamp(24px, 4vh, 36px)',
    paddingInline: { default: 'clamp(20px, 4vw, 56px)', [bp.max560]: 18 },
    display: 'grid',
    justifyItems: 'center',
    gap: 'clamp(20px, 3.5vh, 36px)',
    textAlign: 'center',
  },
  brand: { display: 'inline-flex', alignItems: 'center', gap: 10, color: C.type, textDecorationLine: 'none', fontSize: { default: 28, [bp.max560]: 22 } },
  /* The claim in the mark's two colours, blue running into pink. */
  shout: {
    margin: 0,
    maxWidth: '12ch',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(40px, 9vw, 150px)',
    lineHeight: 0.92,
    textTransform: 'uppercase',
    textWrap: 'balance',
    color: C.blue,
    backgroundImage: `linear-gradient(100deg, ${C.blue} 10%, ${C.pink} 90%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: { margin: 0, maxWidth: '48ch', fontFamily: font.sans, fontWeight: 600, fontSize: { default: 16, [bp.max560]: 14 }, lineHeight: 1.4, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.typeSoft },
  /* Links and socials: side by side on wide screens, stacked and centred
     below that. The copyright and the disclaimer follow on every size. */
  rows: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr) auto', [bp.max991]: 'minmax(0, 1fr)' },
    alignItems: 'center',
    gap: { default: 24, [bp.max991]: 22 },
    paddingTop: 'clamp(8px, 2vh, 20px)',
  },
  block: {},
  links: {
    display: { default: 'flex', [bp.max560]: 'grid' },
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    flexWrap: 'wrap',
    justifyContent: { default: 'flex-start', [bp.max991]: 'center' },
    gap: { default: 2, [bp.max560]: 4 },
  },
  link: {
    paddingBlock: 6,
    paddingInline: 10,
    borderRadius: 8,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: { default: 15, [bp.max560]: 16 },
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: C.type,
    textDecorationLine: 'none',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [bp.hover]: C.plate } },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    outlineColor: C.blue,
  },
  socials: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  social: {
    display: 'inline-grid',
    placeItems: 'center',
    height: { default: 42, [bp.max560]: 38 },
    paddingInline: { default: 16, [bp.max560]: 12 },
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: C.type,
    color: C.type,
    fontFamily: font.sans,
    fontWeight: 700,
    fontSize: { default: 14, [bp.max560]: 13 },
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textDecorationLine: 'none',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [bp.hover]: C.type } },
    transitionProperty: 'background-color, color',
    transitionDuration: '0.2s',
  },
  socialHover: { color: { default: C.type, ':hover': { default: null, [bp.hover]: C.base } } },
  copy: { fontFamily: font.sans, fontWeight: 600, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.typeSoft, whiteSpace: 'nowrap' },
  small: { margin: 0, maxWidth: '80ch', fontFamily: font.sans, fontWeight: 500, fontSize: { default: 13, [bp.max560]: 12 }, letterSpacing: '0.03em', textTransform: 'uppercase', color: C.typeSoft, lineHeight: 1.5 },
});

export type FooterLabels = { shout: string; tagline: string; explore: string; follow: string; copyright: string; disclaimer: string; app: string; items: { href: string; label: string }[] };

export function Footer({ homeHref, labels }: { homeHref: string; labels: FooterLabels }) {
  const socials = [AppConfig.social.x, AppConfig.social.discord, AppConfig.social.instagram];
  return (
    <footer {...stylex.props(styles.foot)}>
      <div {...stylex.props(styles.card)}>
        <a href={homeHref} {...stylex.props(styles.brand)}>
          <Mark size={40} />
          <Wordmark />
        </a>
        <p {...stylex.props(styles.shout)}>{labels.shout}</p>
        <p {...stylex.props(styles.tagline)}>{labels.tagline}</p>
        <div {...stylex.props(styles.rows)}>
          <nav aria-label={labels.explore} {...stylex.props(styles.block, styles.links)}>
            {labels.items.map((item) => (
              <a key={item.href} href={item.href} {...stylex.props(styles.link)}>
                {item.label}
              </a>
            ))}
            <a href={AppConfig.appUrl} {...stylex.props(styles.link)}>
              {labels.app} ↗
            </a>
          </nav>
          <div {...stylex.props(styles.block, styles.socials)} aria-label={labels.follow}>
            {socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener" {...stylex.props(styles.social, styles.socialHover)}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <span {...stylex.props(styles.copy)}>{labels.copyright}</span>
        <p {...stylex.props(styles.small)}>{labels.disclaimer}</p>
      </div>
    </footer>
  );
}
