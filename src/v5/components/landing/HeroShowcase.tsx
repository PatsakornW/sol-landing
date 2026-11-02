'use client';

import { translations } from '@/v5/i18n/messages';
import { OpeningStage } from '@/v5/components/landing/OpeningStage';
import { WaitlistForm } from '@/v5/components/landing/WaitlistForm';

/**
 * The opening and the fold: one large headline over the waitlist, centred on
 * the first screen. The headline's full stop drops into place once the
 * headline is in. The hero rides the opening's pinned stage and rises into place
 * as the mark flies into the header (components/_home.scss, "Opening").
 */
export function HeroShowcase() {
  const t = translations();

  return (
    <div className="opening">
      <OpeningStage />

      <section className="hero">
        {/* The opening moves the section and this body separately: one
            transform each keeps both on the compositor, so the text holds. */}
        <div className="hero__body">
          <h1 className="hero__title" data-opening-title>
            {t('hero.title')}
            {/* The dot is an inline block so it can move, and a browser may
                wrap before one. The word joiner and nowrap keep it on the
                last word's line. */}
            <span className="hero__stop" aria-hidden="true">
              {'\u2060'}
              <span className="hero__dot">.</span>
            </span>
          </h1>
          <WaitlistForm id="waitlist" />
        </div>
      </section>
    </div>
  );
}
