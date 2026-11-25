# prismic-nuxt-4-starter

Base des sites Nuxt 4 + [Prismic](https://prismic.io) : on la duplique pour
démarrer un nouveau site (checklist dans le repo `home`,
`docs/new-nuxt-prismic-project.md`). Gestionnaire de paquets : **pnpm**.

## Setup

```bash
cp .env.sample .env
pnpm install
```

## Commandes

Scripts : `package.json`. `pnpm generate` produit le site statique dans
`dist/` (déployé sur Netlify) ; `pnpm type-gen` régénère
`prismicio-types.d.ts` et les routes de `prismic.config.json`.

## Architecture

- **Routes** : `shared/prismic-schema.ts` associe chaque type de document à
  une route ; tout le reste en dérive (client Prismic, redirections d'alias,
  routes de `prismic.config.json`).
- **Pages** : une page fine par type routable dans `app/pages/`, qui délègue
  le fetch à `useFetchPage` et la méta à `usePrismicMeta`.
- **Composants** : `app/components/`, à plat, préfixés `V`.
  Slices : `app/slices/`.
- **Styles** : SCSS modules, tokens dans `app/assets/scss/`.
- **i18n** : textes d'interface dans `i18n/locales/nuxt.<locale>.json`.

Conventions (front, Nuxt, Prismic) : repo `home`, `docs/`. Détails pour
reprendre le projet (et pour les agents) : `AGENTS.md` ; à corriger avant la
prochaine duplication : `TODO.md`.
