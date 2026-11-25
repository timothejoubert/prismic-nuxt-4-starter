# AGENTS.md

Starter for Timothé's Nuxt 4 + Prismic sites: duplicated to start a new site,
never deployed on its own. This file only adds what is specific to the
starter on top of the conventions in `../home/docs/`.

- Duplicating the starter: follow `../home/docs/new-nuxt-prismic-project.md`,
  whose step 0 happens here first.
- A fix or convention found while building a site is ported back here, so
  the next site starts with it.
- Debugging Prismic, rendering, deploy or a11y: check
  `../home/docs/learnings.md` first; add an entry there when a fix cost time.

## Checking a change

`pnpm test` (Vitest), `pnpm lint`, `pnpm typecheck`, then `pnpm generate`,
which fetches the real Prismic repository. Tests live in `test/unit/` (pure
modules, Node) and `test/nuxt/` (Nuxt environment), never next to the code:
Nuxt scans `app/utils/` for auto-imports.

`pnpm type-gen` runs `npx prismic gen types`, which an agent can't run without
`--task-id` and `--user-intent`: run `npx prismic gen types --task-id … --user-intent …`
then `node scripts/sync-prismic-routes.js` instead.

## Architecture

- Route paths come from `getRoutePath(name)` or `prismicRouteByName`
  (`shared/prismic-schema.ts`), never written by hand.
- Media components (`VPrismicMedia`, `VPrismicImage`, `VPrismicVideo`):
  read `media-components.md` before using or changing them.

## Version notes

- Video.js is pinned to an exact 10.x (v10 is recent and moves fast). Its
  web components are client side only, and their tags are listed one by one
  in `VIDEOJS_ELEMENTS` (`app/constants/videojs.ts`, read by
  `vue.compilerOptions.isCustomElement` in `nuxt.config.ts`): add a tag there
  when a template uses a new one. `@videojs/youtube-video` and
  `@videojs/vimeo-video` are optional peers of `@videojs/html` (which
  re-exports them under `@videojs/html/media/*`): pnpm doesn't install
  optional peers, so they stay direct dependencies, at the same version.
  `react` in `node_modules` comes from an optional peer of `@videojs/store`
  and never reaches the bundle.
- Overrides in `pnpm-workspace.yaml` document their reason and drop
  condition in comments: recheck them on every dependency update.
- `@stylistic/stylelint-plugin` v6 reads SCSS under its `scss/` namespace:
  `@stylistic/scss/indentation` is the rule that indents SCSS and `.vue` styles.
