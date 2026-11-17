# CLAUDE.md

Starter for Timothé's Nuxt 4 + Prismic sites: duplicated to start a new site,
never deployed on its own.

Conventions live in `../home/docs/` (`front-conventions.md`,
`nuxt-conventions.md`, `prismic-conventions.md`); this file only adds what is
specific to the starter, and wins on conflict.

- Duplicating the starter: follow `../home/docs/new-nuxt-prismic-project.md`.
  Its step 0 happens here first: update dependencies, `pnpm audit`, clear
  `TODO.md` and the open issues, commit in this repo.
- A fix or convention found while building a site is ported back here, so
  the next site starts with it.
- Debugging Prismic, rendering, deploy or a11y: check
  `../home/docs/learnings.md` first; add an entry there when a fix cost time.

## Checking a change

No test runner: `pnpm lint`, `pnpm typecheck`, then `pnpm generate`, which
fetches the real Prismic repository.

## Architecture

- Route paths come from `getRoutePath(name)` or `prismicRouteByName`
  (`shared/prismic-schema.ts`), never written by hand.
- Media components: read `media-components.md` before touching them. It is
  the target design (issue #1), not yet the code.

## Version notes

- `pnpm-workspace.yaml` overrides `typescript` to `~6.0.3` (typescript-eslint
  doesn't support TS 7 yet) and `stylelint-order` to `^8` (stylelint 18 peer
  range). Drop each override once its upstream catches up.
- `@stylistic/stylelint-plugin` v6 reads SCSS under its `scss/` namespace:
  `@stylistic/scss/indentation` is the rule that indents SCSS and `.vue` styles.
