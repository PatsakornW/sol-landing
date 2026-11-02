import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { AppStage } from '@/v3/components/AppStage';
import { Manifesto, Truths } from '@/v3/components/Claim';
import { Desks } from '@/v3/components/Desks';
import { Faq, FaqLink } from '@/v3/components/Faq';
import { Footer } from '@/v3/components/Footer';
import { Hero } from '@/v3/components/Hero';
import { Instrument } from '@/v3/components/Instrument';
import { Join } from '@/v3/components/Join';
import { Marquee } from '@/v3/components/Marquee';
import { Mechanism } from '@/v3/components/Mechanism';
import { Nav } from '@/v3/components/Nav';
import { Rail } from '@/v3/components/Rail';
import { ReadyProvider } from '@/v3/components/Ready';
import { translatorFor } from '@/v3/i18n/messages';
import { DESKS } from '@/v3/sample';
import { V3 } from '../../styles/eclipse.stylex';
import { shared } from '@/v3/styles/shared.styles';

const TRUTHS = ['cost', 'moves', 'fact'] as const;
const FAQS = ['custody', 'resolution', 'fees', 'notCasino'] as const;
const STEPS = ['one', 'two', 'three'] as const;

const styles = stylex.create({
  claim: {
    paddingTop: 'clamp(120px, 16vw, 230px)',
    paddingBottom: 'clamp(90px, 11vw, 160px)',
  },
  noteLink: {
    color: V3.dust,
  },
});

/**
 * Revision 3 — the eclipse.
 *
 * One long dark page lit from a single picture: two orbs crossing in the hero,
 * drawn live, and the same two orbs sized by the market price in the claim
 * that follows. The sections are the shipped page's — the app, the three
 * steps, the six desks, the questions, the email — set in a Didone and read
 * top to bottom, with the chrome fixed over it and a rail of dots down the
 * right edge saying where the reader is.
 *
 * Every figure on the page is illustrative and the page says so beside each
 * one. The two forms are demonstrations: nothing is sent or stored.
 */
export function HomeView() {
  const t = translatorFor();
  const homeHref = '#overview';

  const sections = [
    { id: 'overview', label: t('v3.nav.home') },
    { id: 'claim', label: t('v3.nav.claim') },
    { id: 'app', label: t('v3.nav.app') },
    { id: 'mechanism', label: t('v3.nav.how') },
    { id: 'desks', label: t('v3.nav.desks') },
    { id: 'faq', label: t('v3.nav.faq') },
    { id: 'join', label: t('v3.nav.join') },
  ];

  const form = {
    email: t('v3.form.email'),
    placeholder: t('v3.form.placeholder'),
    invalid: t('v3.form.invalid'),
    submitting: t('v3.form.submitting'),
    success: t('v3.form.success'),
    successBody: t('v3.form.successBody'),
    telegram: {
      title: t('v3.form.telegram.title'),
      body: t('v3.form.telegram.body'),
      cta: t('v3.form.telegram.cta'),
    },
    affiliate: {
      title: t('v3.form.affiliate.title'),
      body: t('v3.form.affiliate.body'),
      cta: t('v3.form.affiliate.cta'),
    },
  };

  const desks = DESKS.map((desk) => ({
    key: desk.key,
    name: t(`categories.${desk.key}.name`),
    hint: t(`categories.${desk.key}.hint`),
    base: desk.base,
    image: desk.image,
  }));

  return (
    <ReadyProvider>
      <Nav
        homeHref={homeHref}
        labels={{
          primary: t('nav.label'),
          how: t('v3.nav.how'),
          faq: t('v3.nav.faq'),
          menu: t('nav.menu'),
          sections: sections.slice(1),
          access: {
            trigger: t('v3.access.trigger'),
            triggerShort: t('v3.access.triggerShort'),
            title: t('v3.access.title'),
            body: t('v3.access.body'),
            submit: t('v3.access.submit'),
            note: t('v3.access.note'),
            close: t('v3.access.close'),
          },
          form,
        }}
      />

      <Rail
        label={t('v3.nav.sections')}
        items={sections.map((section) =>
          section.id === 'faq' ? { ...section, label: t('v3.nav.questions') } : section,
        )}
      />

      <Hero
        labels={{
          title: t('v3.hero.title'),
          lineA1: t('v3.hero.lineA1'),
          lineA2: t('v3.hero.lineA2'),
          lineB1: t('v3.hero.lineB1'),
          lineB2: t('v3.hero.lineB2'),
          lead: t('v3.hero.lead'),
          primary: t('v3.hero.primary'),
          secondary: t('v3.hero.secondary'),
          cue: t('v3.hero.cue'),
        }}
      />

      <Marquee words={desks.map((desk) => desk.name)} />

      <section id="claim" {...stylex.props(styles.claim, shared.section)} aria-labelledby="claim-title">
        <div {...stylex.props(shared.wrap)}>
          <Manifesto text={t('v3.claim.manifesto')} sub={t('v3.claim.sub')} />
          <Instrument
            labels={{
              figure: t('v3.instrument.figure'),
              eg: t('v3.instrument.eg'),
              question: t('v3.instrument.question'),
              unitA: t('v3.instrument.unitA'),
              unitB: t('v3.instrument.unitB'),
              yes: t('v3.instrument.yes'),
              no: t('v3.instrument.no'),
              drag: t('v3.instrument.drag'),
              tail: t('v3.instrument.tail'),
              fine: t('v3.instrument.fine'),
            }}
          />
          <Truths
            items={TRUTHS.map((key) => ({
              key,
              title: t(`v3.claim.truths.${key}.title`),
              desc: t(`v3.claim.truths.${key}.desc`),
            }))}
          />
        </div>
      </section>

      <AppStage
        labels={{
          title: t('v3.app.title'),
          sub: t('v3.app.sub'),
          host: t('v3.app.host'),
          shot: t('preview.shot'),
          caption: t('preview.caption'),
        }}
      />

      <Mechanism
        labels={{
          title: t('v3.mechanism.title'),
          sub: t('v3.mechanism.sub'),
          steps: STEPS.map((key) => ({
            title: t(`how.${key}.title`),
            desc: t(`how.${key}.desc`),
            shot: t(`how.${key}.shot`),
          })),
        }}
      />

      <Desks labels={{ title: t('v3.desks.title'), sub: t('v3.desks.sub'), desks }} />

      <Faq
        labels={{
          title: t('v3.faq.title'),
          sub: (
            <>
              {t('v3.faq.subBefore')}{' '}
              <FaqLink href={AppConfig.docsUrl}>{t('v3.faq.subLink')}</FaqLink>
              {t('v3.faq.subAfter')}
            </>
          ),
          items: FAQS.map((id) => ({
            id,
            term: t(`faq.${id}.term`),
            definition: t(`faq.${id}.definition`),
          })),
        }}
      />

      <Join
        labels={{
          titleA: t('v3.join.titleA'),
          titleB: t('v3.join.titleB'),
          sub: t('v3.join.sub'),
          cardTitle: t('v3.join.cardTitle'),
          cardBody: t('v3.join.cardBody'),
          submit: t('v3.hero.primary'),
          form,
          note: (
            <>
              {t('v3.join.noteBefore')}{' '}
              <a
                href={AppConfig.docsUrl}
                target="_blank"
                rel="noopener"
                {...stylex.props(styles.noteLink)}
              >
                {t('v3.join.noteLink')}
              </a>
              {t('v3.join.noteAfter')}
            </>
          ),
        }}
      />

      <Footer
        homeHref={homeHref}
        labels={{
          app: t('v3.footer.app'),
          docs: t('v3.footer.docs'),
          contact: t('v3.footer.contact'),
          copyright: t('footer.copyright'),
          disclaimer: t('footer.disclaimer'),
        }}
      />
    </ReadyProvider>
  );
}
