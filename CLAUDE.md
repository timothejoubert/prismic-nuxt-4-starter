# CLAUDE.md

## Project

Starter for Timothé's Nuxt 4 + Prismic sites: duplicated to start a new site,
never deployed on its own. Personal project (`timothejoubert/*` on GitHub), not
a Rezo Zero one. Prismic repository: `nuxt-4-starter` (Type Builder).

Conventions live in the `home` repo (`../home/docs/`) and apply here:
`front-conventions.md`, `nuxt-conventions.md`, `prismic-conventions.md`. This
file only adds what is specific to the starter, and wins on conflict.

- Duplicating the starter: follow `../home/docs/new-nuxt-prismic-project.md`.
  Its step 0 happens here first: update dependencies, `pnpm audit`, clear
  `TODO.md` and the open issues, commit in this repo.
- A fix or convention found while building a site is ported back here, so
  the next site starts with it.
- Debugging Prismic, rendering, deploy or a11y: check
  `../home/docs/learnings.md` first; add an entry there when a fix cost time.

## Commands

```bash
pnpm dev              # dev server (localhost:3000)
pnpm generate         # static site in dist/ (netlify-static preset)
pnpm build            # server build
pnpm lint             # eslint + stylelint (lint-fix to fix)
pnpm typecheck        # vue-tsc
pnpm type-gen         # prismic gen types + scripts/sync-prismic-routes.js
```

No test runner. Check a change with `pnpm lint`, `pnpm typecheck` and
`pnpm generate` (it fetches the real Prismic repository).

## Prismic

- `shared/prismic-schema.ts` is the single source of truth: `prismicDocumentType`
  (checked against the generated types with `satisfies`) and
  `prismicDocumentRoutes`. Client routes, alias redirects
  (`getPrismicAliasRedirects`), `isDynamicDocument` and the `routes` field of
  `prismic.config.json` derive from it. Build paths with `getRoutePath(name)`
  or `prismicRouteByName`, never by hand.
- Adding a routable type: create it in Prismic, `npx prismic pull`,
  `pnpm type-gen`, add its constant and route entry, then a thin page in
  `app/pages/` calling `useFetchPage` and `usePrismicMeta`.
- Models live in `customtypes/` and `app/slices/*/model.json`; generated
  files are `prismicio-types.d.ts`, `app/slices/index.ts` and the `routes` of
  `prismic.config.json` (all rebuilt by `pnpm type-gen`).
- The CLI needs `--task-id` (from `npx prismic task-id`) and `--user-intent`
  on every command when an agent runs it.
- Previews: `/preview` (module route, `app/constants/prismic-preview.ts`) and
  `/slice-simulator`, both registered in the repository
  (`npx prismic preview list`). A new site must register its own URLs.
- `.mcp.json` declares the Prismic MCP server (OAuth on first use), for reading
  content and docs.

## Code map

- Composables: `usePrismicFetchDocument`, `usePrismicFetchDocumentListing`,
  `usePrismicFetchProjects`, `usePrismicMeta`, `useLocale` (Prismic side);
  `useFetchPage`, `usePageMeta`, `useLinkResolver`.
- Prismic field renderers: `VText`
  (string, key text or rich text), `VPrismicLink`, and the media ones below.
- Media, in two layers:
  - generic components: `VImg` (thin `<NuxtImg>` wrapper, `alt` required),
    `VVideo` (native video, `background` mode with pause button and
    reduced-motion check; the one place to plug a player library, see issue #1),
    `VEmbed` (YouTube/Vimeo iframe, loaded on demand behind a `poster` slot);
  - Prismic components: `VPrismicImg` (image field or link to an image, optional
    `views` for art direction with `<picture>`) and `VPrismicMedia`, which
    renders whatever a field holds (embed, video file, image) with an optional
    poster;
  - helpers: `app/utils/media/` (generic: embed URL parsing and player URLs,
    video MIME types, aspect ratio) and `app/utils/prismic/media.ts` (Prismic
    fields → normalized image, video and embed objects; imgix params split into
    modifiers so the crop is kept and the URL never gets a second `?`).
- `app/utils/prismic/` also holds the URL → document type resolver.
- SEO: `@nuxtjs/sitemap` (projects listed by `shared/prismic-sitemap-urls.ts`),
  `@nuxtjs/robots`, `nuxt-schema-org`, site config from `NUXT_PUBLIC_SITE_*`.
- Icons: local SVGs in `app/assets/images/icons`, used as
  `<VIcon name="icon:Play" />`; no runtime icon API.

## Version notes

- `pnpm-workspace.yaml` overrides `typescript` to `~6.0.3` (typescript-eslint
  doesn't support TS 7 yet) and `stylelint-order` to `^8` (stylelint 18 peer
  range). Drop each override once its upstream catches up.
- `@stylistic/stylelint-plugin` v6 reads SCSS under its `scss/` namespace:
  `@stylistic/scss/indentation` is the rule that indents SCSS and `.vue` styles.

## Open points

`TODO.md` lists what blocks the next duplication, and ideas. Tick or remove
an item in the commit that resolves it.
