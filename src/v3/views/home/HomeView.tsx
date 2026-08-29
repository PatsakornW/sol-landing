import * as stylex from '@stylexjs/stylex';
import { WaitlistProvider } from '@/components/landing/Waitlist';
import { color } from '../../../styles/tokens.stylex';
import { ClosePane, Footer, GlassCards, Hero, Section } from '@/v3/components/Blocks';
import { FaqPanel } from '@/v3/components/FaqPanel';
import { PillNav } from '@/v3/components/PillNav';
import { NoteRow } from '@/v3/components/Panes';
import { ParallaxScene } from '@/v3/components/ParallaxScene';
import { StepCards } from '@/v3/components/StepCards';
import { translatorFor } from '@/v3/i18n/messages';

const CATEGORIES = ['crypto', 'politics', 'sports', 'culture', 'tech', 'economy'] as const;
const FAQS = ['custody', 'resolution', 'fees', 'notCasino', 'chain'] as const;
const SURFACE = ['news', 'events', 'ticket'] as const;

const styles = stylex.create({
  /* The page itself is transparent: the fixed backdrop supplies the ground, so
     an opaque page would simply cover it. */
  page: {
    position: 'relative',
    minHeight: '100dvh',
    color: color.fg,
  },
});

/**
 * Revision 6 — revision 5, read without the glass under its heads.
 *
 * Same bands, same cards, same room. The one difference is where the section
 * heads sit: V5 gives each one a frosted haze to hold it off the app behind
 * the page, and this revision takes that away, so the type lands straight on
 * the room and the wash over the scene is the only thing carrying it.
 *
 * A room of floating panes seen in perspective, fixed behind the whole
 * document: the depths part as the page scrolls and lean towards the pointer.
 * Over them, every block of copy sits on frosted glass — a capsule of links for
 * chrome, full-screen bands, panels that let the room through, and a row of
 * figures near the end.
 *
 * The figures are structural — YES+NO summing to a hundred, redemption at 1:1,
 * no custody, six desks — and the band says so in as many words. Nothing here
 * has traded, so there is no usage to quote, and a launch page that invented
 * some would be lying in the one place a reader checks.
 *
 * Every moving surface is the shipped page's: the home clip (here the fixed
 * backdrop), the three mechanism clips, the waitlist form, the access dialog
 * and the kit accordion.
 */
function HomeViewShell() {
  const t = translatorFor();
  const homeHref = '/v3';

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
        <ParallaxScene shot={t('preview.shot')} />

        <PillNav
          homeHref={homeHref}
          labels={{
            navLabel: t('nav.label'),
            home: t('v3.nav.home'),
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

        <Hero
          eyebrow={t('v3.hero.eyebrow')}
          title={t('v3.hero.title')}
          lead={t('v3.hero.lead')}
          primary={t('v3.hero.primary')}
          secondary={t('v3.hero.secondary')}
        />

        {/* The one band that points at the backdrop rather than adding a
            picture of its own — the app is already behind the page, so this
            names what is on screen. */}
        <Section
          id="surface"
          eyebrow={t('v3.heads.surface.eyebrow')}
          title={t('v3.heads.surface.title')}
          lead={t('v3.heads.surface.lead')}
        >
          <NoteRow
            notes={SURFACE.map((key) => ({
              key,
              term: t(`v3.surface.${key}.term`),
              desc: t(`v3.surface.${key}.desc`),
            }))}
          />
        </Section>

        <Section
          id="mechanism"
          eyebrow={t('v3.heads.mechanism.eyebrow')}
          title={t('v3.heads.mechanism.title')}
          lead={t('v3.heads.mechanism.lead')}
        >
          <StepCards
            steps={[
              {
                title: t('how.one.title'),
                desc: t('how.one.desc'),
                shot: t('how.one.shot'),
              },
              {
                title: t('how.two.title'),
                desc: t('how.two.desc'),
                shot: t('how.two.shot'),
              },
              {
                title: t('how.three.title'),
                desc: t('how.three.desc'),
                shot: t('how.three.shot'),
              },
            ]}
          />
        </Section>

        <Section
          id="coverage"
          eyebrow={t('v3.heads.coverage.eyebrow')}
          title={t('v3.heads.coverage.title')}
          lead={t('v3.heads.coverage.lead')}
        >
          <GlassCards
            cards={CATEGORIES.map((key) => ({
              key,
              title: t(`categories.${key}.name`),
              desc: t(`categories.${key}.hint`),
            }))}
          />
        </Section>

        <Section
          id="faq"
          eyebrow={t('v3.heads.questions.eyebrow')}
          title={t('v3.heads.questions.title')}
        >
          <FaqPanel
            note={t('footer.disclaimer')}
            items={FAQS.map((id) => ({
              id,
              title: t(`faq.${id}.term`),
              description: t(`faq.${id}.definition`),
            }))}
          />
        </Section>

        <Section
          id="access"
          eyebrow={t('v3.heads.access.eyebrow')}
          title={t('v3.heads.access.title')}
        >
          <ClosePane body={t('v3.close.body')} />
        </Section>

        <Footer
          homeHref={homeHref}
          labels={{
            label: t('footer.label'),
            docs: t('footer.docs'),
            app: t('nav.explore'),
            contact: t('nav.contact'),
            copyright: t('footer.copyright'),
            disclaimer: t('footer.disclaimer'),
          }}
        />
      </div>
    </WaitlistProvider>
  );
}

export function HomeView() {
  return <HomeViewShell />;
}
