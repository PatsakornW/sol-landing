# sol_market_landing

Two landing-page designs for SolsMarket, built as a static site for Cloudflare
Pages.

| Route | Design |
|---|---|
| `/` | **Stage** — one idea per screen, poster type, a ground that alternates |
| `/v2` | **Parallax** — full-screen frosted bands over the app, held behind the page |

The corner pill on either page steps to the other and wraps.

## Why it builds the way it does

Every page here is copy and prerendered clips: there is nothing to render per
request. So `next.config.ts` sets `output: 'export'` and the whole site is
written to `out/` at build time — Cloudflare serves it from the edge with no
runtime at all, and there is no adapter between Next and Pages to keep in step
with either.

The one thing that does need a server is the news rail, which reaches an
upstream feed and proxies its images so the dither canvas can read their
pixels — a canvas cannot read back a cross-origin bitmap. Those two endpoints
live in `functions/`, which Pages runs as Workers beside the static files, so
`/api/news-feed` and `/api/news-image` keep working. Without them the clips
fall back to their sample rows, which is what you see in `next dev`.

## Working on it

```bash
pnpm install
pnpm dev            # Next dev server on :3200 (no Functions, sample news)
pnpm build          # static export to out/
pnpm preview        # serve out/ as plain files
pnpm preview:cf     # wrangler: out/ + functions/, the real thing
pnpm typecheck
pnpm lint
```

`pnpm preview:cf` is the one that exercises the Functions. Use it before a
deploy if you have touched anything under `functions/`.

## Deploying

Every push to `main` deploys through GitHub Actions
(`.github/workflows/deploy.yml`): install, typecheck, lint, build, then
`wrangler pages deploy` to the Cloudflare Pages project named in
`wrangler.toml` (`sol-landing`). Pull requests get a preview deployment on
their own branch alias.

The workflow needs two repository **secrets**:

- `CLOUDFLARE_API_TOKEN` — a token with the *Cloudflare Pages: Edit* permission
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar

and reads the three `NEXT_PUBLIC_*` variables below from repository
**variables** (they fall back to their defaults when unset). Create the Pages
project once beforehand, either in the dashboard (Workers & Pages → Create →
Pages → Direct Upload) or from a terminal:

```bash
pnpm exec wrangler pages project create sol-landing --production-branch main
```

To deploy by hand instead:

```bash
pnpm build && pnpm deploy
```

`public/_headers` ships with the export and tells Pages to cache the
fingerprinted bundles and the fonts forever, and nothing else.

### Environment

| Variable | Where | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | build | `https://solsmarket.xyz` |
| `NEXT_PUBLIC_APP_URL` | build | `http://localhost:3000` |
| `NEXT_PUBLIC_DOCS_URL` | build | `https://docs.solsmarket.xyz` |
| `NEWS_API_PROXY_TARGET` | Pages Function | the upstream news API |

The first three are read at build time, so they belong in the Pages build
environment. The last is read per request by `functions/api/news-feed.ts` and
belongs in the Pages runtime environment.

## Shape of the source

```
src/app/(site)/   the stage design, at /
src/app/(v2)/     the parallax design, at /v2
src/v1/           everything the stage design owns — its chrome, blocks, theme, copy
src/v2/           the same for the parallax design
src/components/   shared: brand, waitlist, access dialog, the Remotion clips
src/lib/          news feed, dither, Remotion helpers, the design switch
functions/        the two Cloudflare Pages Functions
```

Each design is a **separate document**: its own root layout, faces, palette,
corner scale, chrome and copy. Moving between them is a full page load rather
than a class on a shell, which is why they can disagree about everything.

The site is English only and dark only. There is no locale segment, no
translation runtime, and no theme switch — one catalogue of copy in
`src/locales/en/landing.json`, read through a fifty-line translator that throws
on a missing key so a typo fails the build instead of shipping.
