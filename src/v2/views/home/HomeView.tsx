import * as stylex from '@stylexjs/stylex';
import { WaitlistProvider } from '@/components/landing/Waitlist';
import { media } from '../../../styles/breakpoints.stylex';
import { color } from '../../../styles/tokens.stylex';
import { ClaimBoard } from '@/v2/components/ClaimBoard';
import { OpeningStage } from '@/v2/components/OpeningStage';
import { Stage } from '@/v2/components/Stage';
import { StageClip } from '@/v2/components/StageClip';
import { StageClose, StageList } from '@/v2/components/StageBlocks';
import { StageNav } from '@/v2/components/StageNav';
import { StageSteps } from '@/v2/components/StageSteps';
import { translatorFor } from '@/v2/i18n/messages';

const CATEGORIES = ['crypto', 'politics', 'sports', 'culture', 'tech', 'economy'] as const;
const FAQS = ['custody', 'resolution', 'fees', 'notCasino'] as const;
const CLAIM_POINTS = ['skin', 'moves', 'settles'] as const;

const styles = stylex.create({
  /* The scroll container itself: snapping is `proximity`, not `mandatory` — a
     stage taller than the viewport (a long headline on a phone, or a reader at 200%)
     must stay scrollable through its own tail rather than being yanked to the
     next screen. */
  page: {
    minHeight: '100dvh',
    backgroundColor: color.surface3,
    color: color.fg,
    scrollSnapType: { default: 'none', [media.md]: 'y proximity' },
  },
});

/**
 * Revision 6 — the same product, staged.
 *
 * One idea per screen, poster type, and a ground that alternates between them.
 * Every moving surface is the
 * shipped page's: the dithered plates (here a low-contrast backdrop for the
 * opening shot), the home clip, the three mechanism clips, the waitlist form
 * and the access dialog. Two stages come from catalogue copy V1 never puts on
 * the page (`features.*`, `categories.*`).
 */
function HomeViewShell() {
  const t = translatorFor();
  const homeHref = '/';

  return (
    <WaitlistProvider
      labels={{
        join: t('waitlist.join'),
        confirm: t('waitlist.confirm'),
        email: t('waitlist.email'),
        joined: t('waitlist.joined'),
        invalid: t('waitlist.invalid'),
        docs: t('waitlist.docs'),
      }}
    >
      <div {...stylex.props(styles.page)}>
        <StageNav
          homeHref={homeHref}
          labels={{
            navLabel: t('nav.label'),
            how: t('nav.how'),
            faq: t('faq.eyebrow'),
            docs: t('nav.docs'),
            menu: t('nav.menu'),
            close: t('nav.close'),
            access: {
              trigger: t('nav.access'),
              triggerShort: t('nav.accessShort'),
              close: t('nav.close'),
              title: t('access.title'),
              titleAccent: t('access.titleAccent'),
              body: t('access.body'),
              perk: t('access.perk'),
              notice: t('access.notice'),
            },
          }}
        />

        <OpeningStage
          title={t('v2.hero.title')}
          titleAccent={t('v2.hero.accent')}
          lead={t('v2.hero.lead')}
        />

        {/* A stage the shipped page has no equivalent for: the argument for a
            prediction market at all, with nothing else on screen to dilute it. */}
        <Stage
          id="claim"
          num="01"
          label={t('v2.stage.claim')}
          title={t('v2.heads.claim.title')}
          lead={t('v2.heads.claim.lead')}
        >
          <ClaimBoard
            labels={{
              label: t('v2.claim.label'),
              question: t('v2.claim.question'),
              yes: t('v2.claim.yes'),
              no: t('v2.claim.no'),
              reading: t('v2.claim.reading'),
              note: t('v2.claim.note'),
            }}
            points={CLAIM_POINTS.map((key) => ({
              key,
              term: t(`v2.claim.points.${key}.term`),
              desc: t(`v2.claim.points.${key}.desc`),
            }))}
          />
        </Stage>

        {/* The copy inside the plate is the app's own English UI, the same way
            the mechanism clips carry theirs — only the framing is localised. */}
        <Stage
          id="preview"
          num="02"
          label={t('v2.stage.surface')}
          title={t('v2.heads.surface.title')}
          lead={t('v2.heads.surface.lead')}
        >
          <StageClip caption={t('preview.caption')} shot={t('preview.shot')} />
        </Stage>

        <Stage
          id="mechanism"
          num="03"
          label={t('v2.stage.mechanism')}
          title={t('v2.heads.mechanism.title')}
          lead={t('v2.heads.mechanism.lead')}
        >
          <StageSteps
            steps={[
              { title: t('how.one.title'), desc: t('how.one.desc'), shot: t('how.one.shot') },
              { title: t('how.two.title'), desc: t('how.two.desc'), shot: t('how.two.shot') },
              {
                title: t('how.three.title'),
                desc: t('how.three.desc'),
                shot: t('how.three.shot'),
              },
            ]}
          />
        </Stage>

        <Stage
          id="coverage"
          num="04"
          label={t('v2.stage.coverage')}
          title={t('v2.heads.coverage.title')}
          lead={t('v2.heads.coverage.lead')}
          invert
        >
          <StageList
            invert
            rows={CATEGORIES.map((key) => ({
              key,
              term: t(`categories.${key}.name`),
              desc: t(`categories.${key}.hint`),
            }))}
          />
        </Stage>

        <Stage
          id="faq"
          num="05"
          label={t('v2.stage.questions')}
          title={t('v2.heads.questions.title')}
          lead={t('v2.heads.questions.lead')}
        >
          <StageList
            rows={FAQS.map((id) => ({
              key: id,
              term: t(`faq.${id}.term`),
              desc: t(`faq.${id}.definition`),
            }))}
          />
        </Stage>

        <Stage
          id="access"
          num="06"
          label={t('v2.stage.close')}
          title={t('v2.heads.close.title')}
          lead={t('v2.heads.close.lead')}
        >
          <StageClose
            labels={{
              kicker: t('close.marker'),
              body: t('close.title'),
              note: t('close.body'),
              docs: t('footer.docs'),
              app: t('nav.explore'),
              contact: t('nav.contact'),
              copyright: t('footer.copyright'),
              disclaimer: t('footer.disclaimer'),
            }}
          />
        </Stage>
      </div>
    </WaitlistProvider>
  );
}

export function HomeView() {
  return <HomeViewShell />;
}
