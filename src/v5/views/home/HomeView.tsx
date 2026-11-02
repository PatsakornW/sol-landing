"use client";

import { AppConfig } from "@/configs/configs";
import { CategoryFan } from "@/v5/components/landing/CategoryFan";
import { CapsuleSplit } from "@/v5/components/landing/CapsuleSplit";
import { ClaimStack } from "@/v5/components/landing/ClaimStack";
import { SectionHead } from "@/v5/components/landing/SectionHead";
import { HeroShowcase } from "@/v5/components/landing/HeroShowcase";
import { WaitlistForm } from "@/v5/components/landing/WaitlistForm";
import { WordRoller } from "@/v5/components/landing/WordRoller";
import { useHashLanding } from "@/v5/hooks/useHashLanding";
import { translations } from "@/v5/i18n/messages";
import { HugeiconsIcon, ArrowRightIcon, PlusIcon } from "@/v5/lib/icons";

// `href` is where each poster's button leads: the part of the page that shows it.
const FEATURES = [
  { key: "onchain", href: "#how-it-works" },
  { key: "instant", href: "#how-it-works" },
  { key: "noncustodial", href: "#faq" },
  { key: "oracle", href: "#faq" },
] as const;

const FAQS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

/**
 * Revision 6 — the sols_market landing page, carried over whole.
 *
 * The opening and its fold, the four claims (#feature), how it works
 * (#how-it-works: a rolling headline), categories, the closing waitlist (#join:
 * Yes and No parting around a capsule that opens onto the form), and the FAQ
 * (#faq). Surfaces, buttons and type follow the web app. The source's contact
 * page is not carried over: its buttons open an email instead.
 */
export function HomeView() {
  const t = translations();
  useHashLanding();

  return (
    <>
      <HeroShowcase />

      <section className="sec" id="feature">
        <SectionHead
          eyebrow={t("features.eyebrow")}
          title={t("features.title")}
          lead={t("features.subtitle")}
        />
        <ClaimStack
          claims={FEATURES.map((f) => ({
            key: f.key,
            href: f.href,
            mark: t(`features.${f.key}.mark`),
            title: t(`features.${f.key}.title`),
            label: t(`features.${f.key}.label`),
            desc: t(`features.${f.key}.desc`),
            facts: (["a", "b", "c"] as const).map((n) => ({
              label: t(`features.${f.key}.facts.${n}.label`),
              value: t(`features.${f.key}.facts.${n}.value`),
            })),
            action: t("features.more"),
          }))}
        />
      </section>

      <section className="sec" id="how-it-works" aria-labelledby="how-title">
        <WordRoller
          id="how-title"
          eyebrow={t("how.eyebrow")}
          words={t.raw("how.roller.words") as string[]}
          suffix={t("how.roller.suffix")}
          sentence={t("how.roller.sentence")}
          lead={t("how.lead")}
        >
          <a href="#join" className="btn btn--secondary">
            {t("how.cta")}
            <HugeiconsIcon icon={ArrowRightIcon} size={16} strokeWidth={2} />
          </a>
        </WordRoller>
      </section>

      <section className="sec sec--cats" aria-labelledby="categories-title">
        <SectionHead
          id="categories-title"
          align="center"
          eyebrow={t("categories.eyebrow")}
          title={t("categories.title")}
          lead={t("categories.subtitle")}
        />
        <CategoryFan />
      </section>

      <section
        className="sec sec--closing"
        id="join"
        aria-labelledby="join-title"
      >
        <SectionHead
          id="join-title"
          align="center"
          eyebrow={t("cta.eyebrow")}
          title={t("cta.title")}
        />
        <CapsuleSplit yes={t("demo.yes")} no={t("demo.no")}>
          <WaitlistForm id="join-form" />
        </CapsuleSplit>
      </section>

      <section className="sec sec--split" id="faq">
        <div className="sec__aside">
          <SectionHead
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            lead={t("faq.lead")}
          >
            <a
              href={`mailto:${AppConfig.email}`}
              className="btn btn--secondary"
            >
              {t("faq.cta")}
              <HugeiconsIcon icon={ArrowRightIcon} size={16} strokeWidth={2} />
            </a>
          </SectionHead>
        </div>
        <div className="card faq">
          {FAQS.map((q) => (
            <details className="faq__item" key={q}>
              <summary className="faq__q">
                {t(`faq.${q}.q`)}
                <HugeiconsIcon
                  className="faq__icon"
                  icon={PlusIcon}
                  size={18}
                  strokeWidth={1.8}
                />
              </summary>
              <p className="faq__a">{t(`faq.${q}.a`)}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
