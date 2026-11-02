# sol_market_landing

Seven landing-page designs for SolsMarket, built as a static site for GitHub
Pages.

| Route | Design |
|---|---|
| `/` | **Stage** — one idea per screen, poster type, a ground that alternates |
| `/v2` | **Parallax** — full-screen frosted bands over the app, held behind the page |
| `/v3` | **Eclipse** — one dark page lit by two orbs crossing in a WebGL hero, set in Geist; its waitlist forms show the mock request, then the Telegram and affiliate cards |
| `/v4` | **Black vault** — V5's content on a dark grid (Instrument Serif, Manrope): a live 3D coin in matte black and chrome with the mark in relief, three frosted step cards with 3D coins rolling in, the chance as a 3D "62%", three live market cards on a deck like the steps' (two Yes/No, one with three outcomes), a five-minute Up/Down chart beside a headline that rolls through what has a price, the platform on a grid of tiles, the risks on a stack of windows, the questions, and a 3D marquee over the footer |
| `/v5` | **Sunrise** — the sols_market app's own landing page: a WebGL sun that sets into the mark, stacking claim posters, a rolling headline, a fan of market cards (Inter, SCSS) |
| `/v6` | **Candy shelf** — V5's content and dark palette on a sweet-shop page: a counting curtain, a sticky opening, whole-screen claims in colour, a pinned shelf that scrolls sideways while the mark turns in 3D, a curved banner, V5's market cards dealt onto a fan (Changa One, Barlow Condensed, GSAP + Lenis) |
| `/v7` | **Card stack** — V5's content on a white page of rounded full-screen cards (Figtree): a 3D disc still life, a close-up that holds while its line rolls on scroll, the waitlist card sliding over it, a card that shrinks into the platform block, four figures rolling in a pill, the desks as a big hover list, the questions, menu and waitlist as white sheets |
| `/v8` | **Glass stage** — V5's content on one black stage scrubbed by the scroll (Inter): a colour field behind fluted glass, the four steps rising through a blue-to-rose wash, a price card counting up to 62¢, two orders matching off-chain and settling as a batch on Solana, a Yes coin and a No coin closing into the mark over a solid gradient USDC, the desk cards fanned, the six questions as a card stack, the field turning behind every scene and on under the footer |
| `/v9` | **Zoom** — V5's content on one pinned stage on V6's dark (Anton, Nunito): the hero's line among drifting 3D coins zooms past the screen, each statement grows from a speck to fill the screen and on through it while market cards and 3D pieces fly out of the middle, the lettering turning pink, blue, violet and pink; one word in each line flips into a pill that opens a sheet; a closing call with two tilted pills |

A dropdown in the corner of every page lists all nine: the button shows the
design that is open, and the list opens upward from it (the browser's own
popover, so no script).

## Why it builds the way it does

Every page here is copy and prerendered clips: there is nothing to render per
request. So `next.config.ts` sets `output: 'export'` and the whole site is
written to `out/` at build time — Pages serves the files as they are, with no
runtime and no adapter between Next and the host to keep in step.

The clips inside the plates draw from the sample rows in
`src/components/motion/sample-data.ts`, and the eclipse page's mock screens
from `src/v3/sample.ts`. The Google faces (Geist for
V3, Instrument Serif and Manrope for V4) come through `next/font`, which
downloads and self-hosts them at build time, so a build needs the network
once. Nothing on the site reaches out at request time.

## Working on it

```bash
pnpm install
pnpm dev            # Next dev server on :3200
pnpm build          # static export to out/
pnpm preview        # serve out/ as plain files
pnpm typecheck
pnpm lint
```

## Deploying

Every push to `main` deploys through GitHub Actions
(`.github/workflows/deploy.yml`): install, typecheck, lint, build, then
publish `out/` to GitHub Pages. One repository setting has to be made once
by hand: **Settings → Pages → Build and deployment → Source** set to *GitHub
Actions*. GitHub only offers Pages on a private repository to paid plans, so
on a free account the repository has to be public for that setting to exist.

A project site is served at `https://<owner>.github.io/<repo>`, so the
workflow derives the base path (`/sol-landing`) and the site URL from the
repository name and passes them to the build as `NEXT_PUBLIC_BASE_PATH` and
`NEXT_PUBLIC_SITE_URL`. `next.config.ts` turns the base path into Next's
`basePath`, which `<Link>` and the router honour on their own; the few plain
`<img src>` and metadata URLs go through `asset()` in `src/configs/configs.ts`
to pick it up too.

### Environment

| Variable | Default |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | empty locally; `/<repo>` in the workflow |
| `NEXT_PUBLIC_SITE_URL` | `https://solsmarket.xyz` locally; the Pages URL in the workflow |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_DOCS_URL` | `https://docs.solsmarket.xyz` |

All are read at build time. Each can be overridden as a repository
**variable** (Settings → Secrets and variables → Actions → Variables). For a
custom domain set `NEXT_PUBLIC_SITE_URL` to the domain and
`NEXT_PUBLIC_BASE_PATH` to a single space — the workflow trims it to nothing,
and everything sits at the root.

## Shape of the source

```
src/app/(site)/   the stage design, at /
src/app/(v2)/     the parallax design, at /v2
src/app/(v3)/     the eclipse design, at /v3
src/app/(v4)/     the black vault, at /v4
src/v1/           everything the stage design owns — its chrome, blocks, theme, copy
src/v2/           the same for the parallax design
src/v3/           the same for the eclipse design; its pictures live in public/v3/
src/v4/           the black vault: plain CSS (styles/v4.css), a live three.js coin (lib/coin.ts); its 3D pieces in public/v4/
src/v5/           the sols_market landing page, in its own SCSS; see below
src/v6/           the candy shelf: V5's copy on a scroll-driven page; its 3D pieces live in public/v6/
src/v7/           the card stack: plain CSS (styles/v7.css) and three.js disc scenes (lib/discs.ts)
src/v8/           the glass stage: plain CSS (styles/v8.css) and one WebGL field shader (lib/field.ts)
src/v9/           the zoom: plain CSS (styles/v9.css); its 3D pieces are V6's, in public/v6/
src/components/   shared: brand, waitlist, access dialog, the Remotion clips
src/lib/          dither, Remotion helpers, the list of designs
```

Each design is a **separate document**: its own root layout, faces, palette,
corner scale, chrome and copy. Moving between them is a full page load rather
than a class on a shell, which is why they can disagree about everything.

The site is English only and dark only. There is no locale segment, no
translation runtime, and no theme switch — one catalogue of copy in
`src/locales/en/landing.json` (each revision adds its own lines under its
own key), read through a fifty-line translator that throws
on a missing key so a typo fails the build instead of shipping.

## V4

Laid out from a reference page's desktop, tablet and phone layouts, with V5's
content and the mark's pink (and blue, in the 3D gradients) where the reference
uses neon green. The copy is V5's (`src/v4/locales`); a few short labels — the
market cards' note, the live chart's tags and question, the rolling headline's
subjects, "Know the risks" — are V4's own,
and every chance on the page is illustrative. The page is plain CSS in
`src/v4/styles/v4.css` (resets in `@layer base`, as in V7–V9).

The 3D pieces are V4's own, made in the reference's manner — matte black,
chrome, grey clay and a glossy pink spark — by `tools/v4-icons` (three.js in
headless Chrome, exported as transparent WebP to `public/v4/`): the hero
coin with the mark in chrome relief, spheres, the spark, a glass rod, six
coins (SOL, B, YES, NO, $, ?), a gavel and a ballot box for the platform
grid's sides, and "62%" and the name extruded in a pink-to-blue gradient. The
hero coin is also live (`src/v4/lib/coin.ts`): the same piece in three.js,
swaying, leaning toward the pointer and turning as the page scrolls; the
rendered still stands in until it draws.

On every load the decor pops in, then the coin, the lines and the button. On a
wide screen the header's panel lists the sections over the hero and folds to
"Menu +" once the page moves; the step cards drift at their own speeds over
their title, which blurs as they pass; the coins roll into each card; the 3D
chance pulls into focus; the market cards drift over their head the same way, their bars fill and
their chances count up; the live chart's lines draw and its headline swaps subject
every couple of seconds; the tiles and the windows come in; the decor drifts at its own
speeds throughout. Below 1024px the header is the name and a round button that
opens the sections as a full panel, the steps and the market cards become swipe sliders whose dots also
jump to a card (Lenis stays off on touch screens, so a swipe reaches the
slider), and the questions open in place. The waitlist has
the same mock request, Telegram and affiliate cards as V5–V9 (a timer, sending
nothing); the footer links to X only.

## V5

The sols_market repository's own landing page (`apps/landing` at commit
`ee68a02` on `develop`), carried over as it shipped rather than restated in
StyleX: its SCSS is in `src/v5/styles/` and its components in `src/v5/`. What
changed in the move: the two-locale routing and language switch are gone (the
site is English only), the contact page became a mail link, the referral code
that rode on every app link is dropped, and the copy sits under a `v5` key in
`src/v5/locales/en/landing.json`. Geist Mono comes from `@fontsource`; Inter
is the file this repository already ships. Added since: once the waitlist form
succeeds, two cards follow it — the Telegram group (`AppConfig.social.telegram`)
and a note on the affiliate programme; under the Yes/No capsule the block
makes room for them, and on stacked screens the words step aside.

## V6

The sols_market landing page's content (V5's catalogue, copied under
`src/v6/locales`) on a page built the way a sweet brand's site is: GSAP's
ScrollTrigger and SplitText, with Lenis driving the scroll. The opening is
sticky and the next screen slides over it; the four claims are four whole
screens in colour; how it works is a pinned shelf that scrolls sideways while
the brand mark turns in three.js; the market cards pile onto one spot; the
questions slide past on a pinned shelf. The ground, plates and type are V5's
dark theme; everything coloured is the mark's blue and pink in a light and a
deep step, Yes in the blue and No in the pink. The market cards are V5's own, set in Inter and dealt onto
the same arc its fan opens to. Every 3D piece in `public/v6/` was
rendered from primitives in three.js (`tools/v6-icons/`, which says how to run
it) and exported as a transparent WebP, so nothing on the page
comes from an image service. The one shared file it touches is
`src/lib/revisions.ts`, which is what puts it in the corner switch. The
waitlist button spins while the sign-up runs, and the success bar is followed
by the same Telegram and affiliate cards as V5 and V7.

## V7

Laid out from a screen recording of a reference page, desktop and phone
(`tools/ref/`), with V5's content and the mark's colours in place of the
reference's. The copy is V5's (`src/v7/locales`), plus a few lines of V7's
own: the four figures in How it works are restated from V5's FAQ and lead. The
page is plain CSS in `src/v7/styles/v7.css` (its resets sit in
`@layer base` so the StyleX corner switch keeps its styles).

A curtain with only the mark in 3D, which fills with colour from the bottom up
as it loads (on the clock, so a slow device cannot stall it), covers the page
until the hero's scene has drawn its first frame, then lifts and the hero comes in; it is in the
static HTML, and lifts on its own after 8s if the scripts never run.

From the top: the hero card and the film card are live three.js scenes of
glossy discs, pucks and frosted plates, with the mark itself as a pair of
discs, pink-striped and blue, floating among them (`src/v7/lib/discs.ts`, one preset
per place, each rendering only while on screen; only the hero's is built at
load, the rest as they come near). The film card holds the screen while the
page scrolls through V5's roller, one subject per step ("Bitcoin has a
price." … "Every question has a price."), with a step counter; only after the
last does the waitlist card slide up over it. The waitlist card's chips pick desks, which the
waitlist sheet then lists. From 1024px the platform block pins: the card
shrinks to the middle of a white page, the lead and the four claims come in
either side, and the card's 3D icon changes with each claim. How it works pins for
four screens while the pill rolls through the figures and the colour walks from
blue to pink. Discs tumble across the seam between the two statements, the
desks list turns its row into a black band with the desk's 3D icon opening
in a pill before the name. The questions pin for six stretches of scroll, each opening the next answer
(a click opens its answer at once and glides to its step), and the closing card pairs the contact line, the
address and the waitlist with the mark's discs in a tall window. The menu is a white sheet
that drops from the top with the footer's "More" links and a Join button (the
links close the sheet and go to their section); choosing a desk in the desks
list picks it and opens the waitlist. Below 1024px
nothing pins and every block stacks: the platform card cycles its icon on
its own, the claims become tiles with their icons, and the desks become tiles in
the theme's violet, the icon in the middle and the name under it. The nav pill holds the mark, the footer's "More" links and a Join button
(on a phone: the mark, Join and a hamburger that opens the menu sheet), and
takes a firmer ground and a shadow once the page moves.

The 3D icons are V6's renders in `public/v6/`. The waitlist form shows a
spinner and then a success state on its button, followed by the way into the
Telegram group and a note on the affiliate programme; the wait is a timer, and
it sends nothing yet.

## V8

Laid out from a reference page's desktop and phone layouts, with V5's content
and the mark's pink and blue in place of the reference's colours. The copy is
V5's (`src/v8/locales`); the small labels on the price card, the order flow
and the coins are V8's own, and every figure on them is illustrative. The page
is plain CSS in `src/v8/styles/v8.css` (resets in `@layer base`, as in V7).

Two layouts come from one tree. On a screen at least 1024 × 560 that allows
motion, an inline script in the layout sets `html.is-stage` before first paint:
every scene is pinned to the viewport and one GSAP timeline, scrubbed over a
tall empty track, places them all — the hero lifts and blurs while the field
sinks; How it works rises; the four steps (custody, matching, settlement,
resolution, each with a bar showing the step in the app) run up as one column
while the wash walks blue → violet → pink → rose; a glass price card counts a
Yes share up to 62¢ while its 0–1 USDC bar fills (Yes 62¢ + No 38¢ = 1 USDC);
a Yes order and a No order meet in the off-chain book and match, a pulse runs
along the wire, and the trade lands on the Solana panel as the newest batch; a
pink Yes coin and a blue No coin slide in and close into the mark, which rises
over the solid gradient USDC; the three desk cards (the same dark grey as the question tiles) fan in (they can be dragged, and spring
back); V5's six questions come as a stack, one card in view, each stretch of scroll
laying the next over it; and the footer pushes the scenes and the header up
over the same field. The header runs the full width — the mark and the name at the left, a link
to every section in the middle (the one in view lit, scrolling to that point
of the timeline), the waitlist button at the right; below 1100px the links
fold into a hamburger at the far right, after the waitlist button. Anywhere else the
scenes stack and rise in as they enter, the steps each in a CSS glow behind
fluted stripes; on every load the field blooms out of the dark (the shader's
`intro`) while the header drops, the name tracks in out of a blur and the lead
and button rise; with motion allowed the price card, the order flow (down a
vertical wire) and the question stack pin to the screen and play with the
scroll as on the stage, the desk cards fan in smaller as their section scrolls
up, and the coins close as they enter. The plays themselves live once, in
`src/v8/lib/plays.ts`, and both layouts call them.

The field is one fragment shader (`src/v8/lib/field.ts`): the
stage's blob and step wash, which the timeline writes into: after the steps the
blob comes back and turns with the scroll behind every scene, footer included
(on the stack it stays fixed behind the page and turns the same way). It draws at 70% resolution, pauses off screen, and leaves a CSS
gradient in place when WebGL is missing. The waitlist is a glass dialog with the
same mock request, Telegram and affiliate cards as V4–V7 (a timer, sending
nothing).


## V9

Laid out from a reference page's desktop, tablet and phone layouts, with V5's
content, V6's dark ground, and the mark's pink and blue (plus a violet between
them) in the lettering where the reference colours the ground. The copy is V5's (`src/v9/locales`); the short poster
lines are cut from V5's own sentences, and the market cards' figures are
illustrative. The page is plain CSS in `src/v9/styles/v9.css` (resets in
`@layer base`, as in V7 and V8); the lines are set in Anton, the rest in Nunito.

With motion allowed, an inline script in the layout sets `html.is-motion`
before first paint, and the four scenes share one stage that ScrollTrigger pins
for 5.6 screens and scrubs: the hero's TRADE WHAT HAPPENS NEXT, among 3D coins
drifting on their own, zooms past the screen as the coins leave and the mark
in 3D sinks out; EVERY QUESTION HAS A PRICE grows from a speck, then on through
the screen while market cards (where the reference shows photos) and 3D coins
fly out of the middle; the lettering turns blue for AN ORDER BOOK WITH ON-CHAIN
SETTLEMENT, which does the same, then violet while the desks' 3D icons fly out,
and pink for MARKETS ON REAL-WORLD EVENTS. The same timeline runs at every
width; only the type sizes change. In each line one extruded word flips every
few seconds into a pill (How it works, Platform, Markets) that opens a sheet
with V5's words on that subject; the header's Join pill takes the scene's
colour. The stage then lets go into GET NOTIFIED! with two tilted pills —
the waitlist and the questions — and the page ends there, with no footer. The hamburger opens a full-screen menu of the four sheets and the
waitlist, which has the same mock request, Telegram and affiliate cards as
V4–V8. On every load the header bounces down, the top line drops, NEXT pops in
over-size and settles, and the coins pop in one after another. With reduced
motion the scenes stack down the page at rest.

The 3D pieces are V6's renders in `public/v6/`, reused as they are.
