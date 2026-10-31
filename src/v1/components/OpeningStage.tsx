import * as stylex from '@stylexjs/stylex';
import { WaitlistDarkForm } from '@/components/landing/Waitlist';
import { Reveal } from '@/components/landing/Reveal';
import { StageBackdrop } from './StageBackdrop';
import { media } from '../../styles/breakpoints.stylex';
import { color, space } from '../../styles/tokens.stylex';
import { STAGE } from '../styles/stage.stylex';

const styles = stylex.create({
  /* The opening shot. The plates run full-bleed behind the title at low
     contrast, so the first screen is an image with words on it rather than a
     hero card. */
  stage: {
    position: 'relative',
    display: 'grid',
    /* Centred at every width. This used to be bottom-anchored on a wide
       screen, back when the backdrop was a row of print plates that needed the
       room above the copy; the backdrop is now the app, full bleed, and it
       covers the whole stage — so there is nothing left for the copy to make
       way for, and a headline sitting on the floor of a full screen just reads
       as the page having already ended. */
    alignContent: 'center',
    minHeight: STAGE.screen,
    scrollSnapAlign: 'start',
    paddingInline: space.pageInline,
    /* Equal block padding: centring is only honest between equal margins, and
       the top still has to clear the fixed chrome. */
    paddingBlock: { default: 96, [media.md]: 112 },
    backgroundColor: color.surface3,
    overflow: 'hidden',
  },
  /* The backdrop's box. It owns nothing but position: the blur, the dimming
     and the falloff live on the clip inside it, where the composition's own
     geometry is. */
  plates: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: 1180,
    marginInline: 'auto',
    textAlign: { default: 'center', [media.md]: 'start' },
  },
  title: {
    margin: 0,
    marginInline: { default: 'auto', [media.md]: 0 },
    maxWidth: '14ch',
    fontSize: 'clamp(2.8rem, 9vw, 7rem)',
    fontWeight: 600,
    lineHeight: 0.94,
    letterSpacing: '-0.05em',
    color: color.fg,
    textWrap: 'balance',
  },
  accent: {
    display: 'block',
    color: color.landingPrimary,
  },
  lead: {
    margin: 0,
    marginTop: 20,
    marginInline: { default: 'auto', [media.md]: 0 },
    maxWidth: '42ch',
    fontSize: { default: 16, [media.sm]: 19 },
    lineHeight: 1.55,
    color: color.mutedFg,
  },
  form: {
    marginTop: 26,
    marginInline: { default: 'auto', [media.md]: 0 },
    /* Centred with the copy below `md`, left-set with it above: the idle form
       is a single button, and a lone button off to one side under centred type
       reads as a stray. The form lays itself out full-width, so the centring
       has to be the wrapper's own width — neither `text-align` nor
       `justify-items` reaches past a block that already fills the line. */
    width: { default: 'max-content', [media.md]: '100%' },
    maxWidth: '100%',
    textAlign: 'start',
  },
});

/** The opening shot: plates behind, one claim in front. */
export function OpeningStage({
  title,
  titleAccent,
  lead,
}: {
  title: string;
  titleAccent: string;
  lead: string;
}) {
  return (
    <section id="overview" {...stylex.props(styles.stage)} aria-labelledby="overview-title">
      <div {...stylex.props(styles.plates)} aria-hidden>
        <StageBackdrop />
      </div>

      <div {...stylex.props(styles.inner)}>
        <Reveal index={0} immediate>
          <h1 id="overview-title" {...stylex.props(styles.title)}>
            {title}
            <span {...stylex.props(styles.accent)}>{titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal index={1} immediate>
          <p {...stylex.props(styles.lead)}>{lead}</p>
        </Reveal>
        <Reveal index={2} immediate>
          <div {...stylex.props(styles.form)}>
            <WaitlistDarkForm tone="accent" layout="hero" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
