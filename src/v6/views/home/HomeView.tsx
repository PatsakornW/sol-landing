"use client";

import { useEffect, useRef } from "react";
import { AppConfig } from "@/configs/configs";
import { translations } from "@/v6/i18n/messages";
import { Faq } from "@/v6/components/Faq";
import { Features, type Feature } from "@/v6/components/Features";
import { Hero } from "@/v6/components/Hero";
import { HowItWorks, type HowPanel } from "@/v6/components/HowItWorks";
import { Join } from "@/v6/components/Join";
import { Markets, type MarketCard } from "@/v6/components/Markets";
import { Preloader } from "@/v6/components/Preloader";
import { Ribbon } from "@/v6/components/Ribbon";
import {
  gsap,
  magnetic,
  reveals,
  scenes,
  ScrollTrigger,
} from "@/v6/lib/motion";

const FEATURES: {
  key: string;
  href: string;
  icon: Feature["icon"];
  color: string;
  ink?: boolean;
}[] = [
  { key: "onchain", href: "#how-it-works", icon: "vault", color: "#1E69F6" },
  { key: "instant", href: "#how-it-works", icon: "bolt", color: "#8A2FA6" },
  { key: "noncustodial", href: "#faq", icon: "key", color: "#1B1F4A" },
  { key: "oracle", href: "#faq", icon: "gavel", color: "#DC74EC", ink: true },
];

/* The rolling headline's subjects, each with a sample question and price. */
const PANELS: {
  word: number;
  sample: string;
  yes: number;
  icon: HowPanel["icon"];
  color: string;
  ink?: boolean;
}[] = [
  { word: 0, sample: "fan.btc.q", yes: 62, icon: "btc", color: "#1E69F6" },
  { word: 1, sample: "fan.turnout.q", yes: 58, icon: "ballot", color: "#DC74EC", ink: true },
  { word: 2, sample: "fan.final.q", yes: 54, icon: "ball", color: "#1B1F4A" },
  { word: 3, sample: "samples.inflation.q", yes: 37, icon: "tag", color: "#8DB8FF", ink: true },
  { word: 4, sample: "fan.fed.q", yes: 41, icon: "bank", color: "#8A2FA6" },
  { word: 5, sample: "samples.oil.q", yes: 28, icon: "barrel", color: "#143F9E" },
  { word: 6, sample: "samples.gold.q", yes: 66, icon: "gold", color: "#F2B8F6", ink: true },
  { word: 7, sample: "fan.ai.q", yes: 31, icon: "chip", color: "#2B2E44" },
];

const FAQS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

/**
 * Revision 7 — the candy shelf.
 *
 * V5's content on a page that behaves like a sweet shop: a cream curtain that
 * counts in, a sticky opening the next screen slides over, four whole-screen
 * claims in colour, a pinned shelf that scrolls sideways while the mark turns,
 * a curved banner, a pile of market cards, the questions on a sliding shelf
 * and a shout to join.
 */
export function HomeView() {
  const t = translations();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      reveals(el);
    }, el);
    const offMagnetic = magnetic(el);
    const offScenes = scenes(el);
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const settle = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      offScenes();
      offMagnetic();
      ctx.revert();
    };
  }, []);

  const words = t.raw("how.roller.words") as string[];
  const deskName = (key: string) => t(`categories.${key}.name`);

  const cards: MarketCard[] = [
    { id: "sol", variant: "series", tone: "crypto", q: t("fan.sol.q"), yes: 52, vol: "$84.2K", icon: "sol", up: t("fan.sol.up"), down: t("fan.sol.down") },
    { id: "turnout", variant: "cover", tone: "politics", category: deskName("politics"), q: t("fan.turnout.q"), yes: 58, vol: "$0", icon: "ballot" },
    { id: "final", variant: "awaiting", tone: "sports", q: t("fan.final.q"), yes: 54, vol: "$312.4K", icon: "ball" },
    { id: "btc", variant: "binary", tone: "crypto", q: t("fan.btc.q"), yes: 62, vol: "$1.24M", end: t("fan.btc.end"), move: 3, icon: "btc" },
    {
      id: "fed",
      variant: "multi",
      tone: "economy",
      q: t("fan.fed.q"),
      yes: 41,
      vol: "$2.81M",
      end: t("fan.fed.end"),
      icon: "bank",
      outcomes: [
        { name: t("fan.fed.o2"), pct: 41 },
        { name: t("fan.fed.o3"), pct: 37 },
        { name: t("fan.fed.o1"), pct: 22 },
      ],
    },
    { id: "ai", variant: "binary", tone: "tech", q: t("fan.ai.q"), yes: 31, vol: "$486.0K", end: t("fan.ai.end"), move: -2, icon: "chip" },
    { id: "film", variant: "resolved", tone: "culture", q: t("fan.film.q"), yes: 100, vol: "$97.3K", icon: "clapper" },
  ];

  return (
    <div ref={root}>
      <Preloader />
      <Hero
        labels={{
          kicker: t("footer.tagline"),
          title: t("hero.title"),
          scroll: t("hero.scroll"),
        }}
      />
      <Features
        labels={{
          eyebrow: t("features.eyebrow"),
          title: t("features.title"),
          sub: t("features.subtitle"),
          more: t("features.more"),
          items: FEATURES.map((f) => ({
            key: f.key,
            href: f.href,
            icon: f.icon,
            color: f.color,
            ink: f.ink,
            mark: t(`features.${f.key}.mark`),
            label: t(`features.${f.key}.label`),
            title: t(`features.${f.key}.title`),
            desc: t(`features.${f.key}.desc`),
            facts: (["a", "b", "c"] as const).map((n) => ({
              label: t(`features.${f.key}.facts.${n}.label`),
              value: t(`features.${f.key}.facts.${n}.value`),
            })),
          })),
        }}
      />
      <HowItWorks
        labels={{
          eyebrow: t("how.eyebrow"),
          headline: words[words.length - 1] ?? "",
          suffix: t("how.roller.suffix"),
          lead: t("how.lead"),
          cta: t("how.cta"),
          yesLabel: t("demo.yes"),
          implies: t("panels.implies"),
          chance: t("fan.chance"),
          panels: PANELS.map((p) => ({
            word: words[p.word] ?? "",
            q: t(p.sample),
            yes: p.yes,
            icon: p.icon,
            color: p.color,
            ink: p.ink,
          })),
        }}
      />
      <Ribbon
        text={`${t("how.roller.sentence")}  •  ${t("demo.yes")}  •  ${t("demo.no")}`}
      />
      <Markets
        labels={{
          eyebrow: t("categories.eyebrow"),
          title: t("categories.title"),
          sub: t("categories.subtitle"),
          yes: t("demo.yes"),
          no: t("demo.no"),
          chance: t("fan.chance"),
          live: t("fan.live"),
          vol: t("fan.vol"),
          awaiting: t("fan.awaiting"),
          cards,
        }}
      />
      <Faq
        labels={{
          eyebrow: t("faq.eyebrow"),
          title: t("faq.title"),
          lead: t("faq.lead"),
          cta: t("faq.cta"),
          ctaHref: `mailto:${AppConfig.email}`,
          items: FAQS.map((q) => ({
            id: q,
            q: t(`faq.${q}.q`),
            a: t(`faq.${q}.a`),
          })),
        }}
      />
      <Join
        labels={{
          eyebrow: t("cta.eyebrow"),
          title: t("cta.title"),
          contact: t("contact.title"),
          contactHref: `mailto:${AppConfig.email}`,
          form: {
            label: t("waitlist.label"),
            placeholder: t("waitlist.placeholder"),
            button: t("waitlist.button"),
            submitting: t("waitlist.submitting"),
            note: t("waitlist.note"),
            invalid: t("waitlist.invalid"),
            failed: t("waitlist.failed"),
            success: t("waitlist.success"),
            successBody: (email) => t("waitlist.successBody", { email }),
          },
          next: {
            href: AppConfig.social.telegram.url,
            telegram: {
              title: t("waitlist.next.telegram.title"),
              body: t("waitlist.next.telegram.body"),
              cta: t("waitlist.next.telegram.cta"),
            },
            affiliate: {
              title: t("waitlist.next.affiliate.title"),
              body: t("waitlist.next.affiliate.body"),
              cta: t("waitlist.next.affiliate.cta"),
            },
          },
        }}
      />
    </div>
  );
}
