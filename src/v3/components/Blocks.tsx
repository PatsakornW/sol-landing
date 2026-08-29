import type { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { BrandMark, BrandWordmark } from '@/components/brand/BrandMark';
import { WaitlistDarkForm } from '@/components/landing/Waitlist';
import { AppConfig } from '@/configs/configs';
import { Reveal } from '@/components/landing/Reveal';
import { ArrowUpRightIcon, HugeiconsIcon, PlayIcon } from '@/lib/icons';
import { media, motion } from '../../styles/breakpoints.stylex';
import { color, font, space } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

const styles = stylex.create({
  /* Every band is a screen of its own over the fixed shot, and the copy is
     centred in it — the reference reads as a sequence of held frames rather
     than as a column of sections. */
  section: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    alignContent: 'center',
    minHeight: '100svh',
    scrollMarginTop: 80,
    paddingInline: space.pageInline,
    paddingBlock: { default: 96, [media.sm]: 'clamp(96px, 10vw, 160px)' },
  },
  inner: {
    width: '100%',
    maxWidth: 1180,
    marginInline: 'auto',
  },
  /* Type straight onto the room, with nothing behind it. V5 gives its heads a
     frosted haze to sit on; here the page is short enough that the heads are a
     large share of what a reader sees, and a plate under each one turns the
     sequence into a stack of cards. The wash over the scene carries them. */
  head: {
    display: 'grid',
    justifyItems: 'center',
    gap: 16,
    maxWidth: 760,
    marginInline: 'auto',
    marginBottom: { default: 36, [media.sm]: 56 },
    textAlign: 'center',
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: color.mutedFg,
  },
  title: {
    margin: 0,
    fontSize: { default: 30, [media.sm]: 40, [media.md]: 48 },
    fontWeight: 700,
    lineHeight: 1.08,
    letterSpacing: '-0.035em',
    color: color.fg,
    textWrap: 'balance',
  },
  lead: {
    margin: 0,
    maxWidth: '52ch',
    fontSize: { default: 16, [media.sm]: 18.5 },
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },

  /* The opening screen: eyebrow, one enormous line, two actions, held in the
     middle of the frame on both axes — the whole viewport is the composition,
     so the copy sits at its centre rather than riding the top edge. The block
     padding is deliberately equal: with `alignContent: center` an uneven pair
     would shift that centre off the middle of the screen. */
  hero: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    alignContent: 'center',
    justifyItems: 'center',
    minHeight: '100svh',
    scrollMarginTop: 0,
    paddingInline: space.pageInline,
    /* Enough to clear the floating chrome even when the copy runs long. */
    paddingBlock: { default: 104, [media.sm]: 120 },
    textAlign: 'center',
  },
  heroTitle: {
    margin: 0,
    marginTop: 14,
    maxWidth: '18ch',
    fontSize: 'clamp(2.4rem, 7vw, 4.6rem)',
    fontWeight: 700,
    lineHeight: 1.06,
    letterSpacing: '-0.045em',
    color: color.fg,
    textWrap: 'balance',
  },
  heroLead: {
    margin: 0,
    marginTop: 20,
    maxWidth: '46ch',
    fontSize: { default: 16, [media.sm]: 18 },
    lineHeight: 1.6,
    color: color.mutedFg,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: { default: 14, [media.sm]: 22 },
    marginTop: 30,
  },
  /* One filled action and one that is only type with a glyph — the reference's
     "Discover" / "View specs" pairing. The filled one carries the brand blue:
     it is the only thing on the opening screen a reader is being asked to do,
     so it should not have to share that weight with a second button.
     Hover mixes towards the page's own ink, which darkens the blue on a light
     ground and lifts it on a dark one — one declaration, both palettes. */
  primary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingInline: 26,
    borderRadius: GLASS.pill,
    backgroundColor: {
      default: color.landingPrimary,
      ':hover': {
        default: null,
        [media.hover]: `color-mix(in srgb, ${color.landingPrimary} 86%, ${color.fg})`,
      },
    },
    color: color.primaryFg,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    textDecorationLine: 'none',
    transitionProperty: 'background-color, translate',
    transitionDuration: '220ms',
    transitionTimingFunction: motion.ease,
    translate: { default: '0 0', ':active': '0 1px' },
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': color.ring },
    outlineOffset: { default: null, ':focus-visible': 3 },
  },
  quiet: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    minHeight: 48,
    fontSize: 15,
    fontWeight: 600,
    color: { default: color.mutedFg, ':hover': { default: null, [media.hover]: color.fg } },
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '200ms',
    transitionTimingFunction: motion.ease,
  },
  /* Panels: frosted, hairline, cut to the page's corner scale. The ground
     shows through every one of them, which is the whole material. */
  cards: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.md]: 'repeat(2, minmax(0, 1fr))',
    },
    gap: { default: 16, [media.sm]: 24 },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  card: {
    display: 'grid',
    alignContent: 'start',
    gap: 14,
    padding: { default: 24, [media.sm]: 'clamp(28px, 3vw, 44px)' },
    borderRadius: GLASS.panel,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 45%, transparent)`,
    backdropFilter: GLASS.blur,
    WebkitBackdropFilter: GLASS.blur,
    minWidth: 0,
  },
  well: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: GLASS.inner,
    backgroundColor: color.fg,
    color: color.background,
    fontFamily: font.mono,
    fontSize: 15,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  cardTitle: {
    margin: 0,
    fontSize: { default: 20, [media.sm]: 23 },
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    color: color.fg,
  },
  cardBody: {
    margin: 0,
    maxWidth: '46ch',
    fontSize: 15.5,
    lineHeight: 1.65,
    color: color.mutedFg,
    textWrap: 'pretty',
  },

  /* The closing pane and the footer under it. */
  closePane: {
    display: 'grid',
    gap: 20,
    justifyItems: 'center',
    maxWidth: 720,
    marginInline: 'auto',
    padding: { default: 26, [media.sm]: 'clamp(32px, 3.4vw, 52px)' },
    borderRadius: GLASS.panel,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 55%, transparent)`,
    backdropFilter: GLASS.blur,
    WebkitBackdropFilter: GLASS.blur,
    textAlign: 'center',
  },
  closeForm: {
    width: '100%',
    maxWidth: 420,
  },
  footer: {
    position: 'relative',
    zIndex: 1,
    paddingInline: space.pageInline,
    paddingTop: 24,
    paddingBottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
  },
  footInner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: { default: 14, [media.sm]: 22 },
    maxWidth: 1180,
    marginInline: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: color.border,
    fontSize: 13.5,
    color: color.mutedFg,
  },
  footBrand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    marginRight: 'auto',
    color: color.fg,
    textDecorationLine: 'none',
  },
  link: {
    color: { default: color.mutedFg, ':hover': { default: null, [media.hover]: color.fg } },
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    textUnderlineOffset: 3,
  },
  legal: {
    margin: 0,
    marginTop: 14,
    maxWidth: 1180,
    marginInline: 'auto',
    fontSize: 12,
    lineHeight: 1.7,
    color: color.mutedFg,
  },
});

/** One screen of the page. */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} {...stylex.props(styles.section)} aria-labelledby={`${id}-title`}>
      <div {...stylex.props(styles.inner)}>
        <Reveal index={0}>
          <div {...stylex.props(styles.head)}>
            {eyebrow ? <p {...stylex.props(styles.eyebrow)}>{eyebrow}</p> : null}
            <h2 id={`${id}-title`} {...stylex.props(styles.title)}>
              {title}
            </h2>
            {lead ? <p {...stylex.props(styles.lead)}>{lead}</p> : null}
          </div>
        </Reveal>
        {children ? <Reveal index={1}>{children}</Reveal> : null}
      </div>
    </section>
  );
}

/** The opening screen. */
export function Hero({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary: string;
  secondary: string;
}) {
  return (
    <section id="overview" {...stylex.props(styles.hero)} aria-labelledby="overview-title">
      <Reveal index={0} immediate>
        <p {...stylex.props(styles.eyebrow)}>{eyebrow}</p>
      </Reveal>
      <Reveal index={1} immediate>
        <h1 id="overview-title" {...stylex.props(styles.heroTitle)}>
          {title}
        </h1>
      </Reveal>
      <Reveal index={2} immediate>
        <p {...stylex.props(styles.heroLead)}>{lead}</p>
      </Reveal>

      <Reveal index={3} immediate>
        <div {...stylex.props(styles.actions)}>
          <a
            {...stylex.props(styles.primary)}
            href={AppConfig.appUrl}
            target="_blank"
            rel="noreferrer"
          >
            {primary}
            <HugeiconsIcon icon={ArrowUpRightIcon} size={16} strokeWidth={2} />
          </a>
          <a {...stylex.props(styles.quiet)} href="#mechanism">
            <HugeiconsIcon icon={PlayIcon} size={15} strokeWidth={2} />
            {secondary}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export type GlassCard = { key: string; title: string; desc: string };

/** Frosted panels, two up. */
export function GlassCards({ cards }: { cards: readonly GlassCard[] }) {
  return (
    <ul {...stylex.props(styles.cards)}>
      {cards.map((card, index) => (
        <li key={card.key} {...stylex.props(styles.card)}>
          <span {...stylex.props(styles.well)} aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 {...stylex.props(styles.cardTitle)}>{card.title}</h3>
          <p {...stylex.props(styles.cardBody)}>{card.desc}</p>
        </li>
      ))}
    </ul>
  );
}

/** The closing pane. */
export function ClosePane({ body }: { body: string }) {
  return (
    <div {...stylex.props(styles.closePane)}>
      <p {...stylex.props(styles.cardBody)}>{body}</p>
      <div {...stylex.props(styles.closeForm)}>
        <WaitlistDarkForm tone="accent" layout="page" align="center" />
      </div>
    </div>
  );
}

export type FooterLabels = {
  label: string;
  docs: string;
  app: string;
  contact: string;
  copyright: string;
  disclaimer: string;
};

/** One row of links, then the legal line. */
export function Footer({ homeHref, labels }: { homeHref: string; labels: FooterLabels }) {
  return (
    <footer {...stylex.props(styles.footer)} aria-label={labels.label}>
      <div {...stylex.props(styles.footInner)}>
        <a href={homeHref} {...stylex.props(styles.footBrand)} aria-label="solsmarket">
          <BrandMark size={16} />
          <BrandWordmark size="footer" />
        </a>
        <a {...stylex.props(styles.link)} href={AppConfig.appUrl} target="_blank" rel="noreferrer">
          {labels.app}
        </a>
        <a {...stylex.props(styles.link)} href={AppConfig.docsUrl} target="_blank" rel="noreferrer">
          {labels.docs}
        </a>
        <a {...stylex.props(styles.link)} href={`mailto:${AppConfig.email}`}>
          {labels.contact}
        </a>
      </div>
      <p {...stylex.props(styles.legal)}>
        {labels.copyright} · {labels.disclaimer}
      </p>
    </footer>
  );
}
