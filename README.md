# sol_market_landing

Two landing-page designs for SolsMarket, built as a static site for GitHub
Pages.

| Route | Design |
|---|---|
| `/` | **Stage** — one idea per screen, poster type, a ground that alternates |
| `/v2` | **Parallax** — full-screen frosted bands over the app, held behind the page |

The corner pill on either page steps to the other and wraps.

## Why it builds the way it does

Every page here is copy and prerendered clips: there is nothing to render per
request. So `next.config.ts` sets `output: 'export'` and the whole site is
written to `out/` at build time — Pages serves the files as they are, with no
runtime and no adapter between Next and the host to keep in step.

The clips inside the plates draw from the sample rows in
`src/components/motion/sample-data.ts`. Nothing on the site reaches out at
request time.

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
src/v1/           everything the stage design owns — its chrome, blocks, theme, copy
src/v2/           the same for the parallax design
src/components/   shared: brand, waitlist, access dialog, the Remotion clips
src/lib/          dither, Remotion helpers, the design switch
```

Each design is a **separate document**: its own root layout, faces, palette,
corner scale, chrome and copy. Moving between them is a full page load rather
than a class on a shell, which is why they can disagree about everything.

The site is English only and dark only. There is no locale segment, no
translation runtime, and no theme switch — one catalogue of copy in
`src/locales/en/landing.json`, read through a fifty-line translator that throws
on a missing key so a typo fails the build instead of shipping.
