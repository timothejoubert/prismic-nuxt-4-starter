# CLAUDE.md

## Project

Starter for Timothé's Nuxt 4 + Prismic sites: duplicated to start a new site,
never deployed on its own. Personal project (`timothejoubert/*` on GitHub), not
a Rezo Zero one. Prismic repository: `nuxt-4-starter` (Type Builder).

Conventions live in the `home` repo and apply here:
`../home/docs/front-conventions.md`, `nuxt-conventions.md`,
`prismic-conventions.md`. Starting a site from this repo:
`../home/docs/new-nuxt-prismic-project.md`. When a convention changes here,
port it to the starter rather than fixing it again in each site.

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
- Models (`customtypes/`, `app/slices/*/model.json`) change only through the
  Type Builder or the `prismic` CLI (`prismic` skill). Generated files
  (`prismicio-types.d.ts`, `app/slices/index.ts`, `prismic.config.json`
  routes) are never edited by hand.
- The CLI needs `--task-id` (from `npx prismic task-id`) and `--user-intent`
  on every command when an agent runs it.
- Previews: `/preview` (module route, `app/constants/prismic-preview.ts`) and
  `/slice-simulator`, both registered in the repository
  (`npx prismic preview list`). A new site must register its own URLs.
- `.mcp.json` declares the Prismic MCP server (OAuth on first use), for reading
  content and docs.

## Code map

- `app/composables/use-prismic-*.ts` fetch or derive Prismic data
  (`usePrismicFetchDocument`, `usePrismicFetchDocumentListing`,
  `usePrismicFetchProjects`, `usePrismicMeta`, `useLocale`); `use-*.ts` hold the
  rest (`useFetchPage`, `usePageMeta`, `useLinkResolver`).
- `app/components/` is flat, `V`-prefixed. Prismic field renderers: `VText`
  (string, key text or rich text), `VPrismicImg` (image or link to media, imgix
  params moved to modifiers), `VPrismicLink`, `VPrismicEmbed`.
- `app/utils/prismic/` holds field guards and the URL → document type resolver.
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

See `TODO.md`: the committed font (TT Norms Pro) has no known web license, and
`public/` lacks `share.jpg` and the favicon set.
