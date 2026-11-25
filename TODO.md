# TODO

## Urgent
- Font: TT Norms Pro is a commercial font committed in a public repo, with no
  license listed in `home/docs/taste.md`. Replace it with a libre font now, and
  purge it from the git history (deleting the files keeps them in past commits).

## Next
- Créer et utiliser une nouvelle composable qui permet d'extraire les data d'un champ lien de prismic. Ajouter une props "field" dans @VPrismicLink et utiliser cette composable dedans pour y traiter les données.
- `public/`: add generic placeholders for `share.jpg` (default Open Graph image,
  1200×630) and the favicon set (`favicon-*.png`, `apple-touch-icon.png`,
  `site.webmanifest`), so a duplicated site never ships without them. Each site
  replaces them (step in `../home/docs/new-nuxt-prismic-project.md`).

### Composants UI
- `VButton` : API unique `<button>` / `<a>` / `NuxtLink`, variantes, icône, état loading, `aria-disabled`, focus visible.
- `VPopover` + `usePopover` : API native `popover` + anchor positioning, polyfill si nécessaire (dropdowns, tooltips, sélecteur de langue).
- `VDialog` : `<dialog>` natif, focus trap, Échap, scroll lock, retour du focus (lightbox, menu mobile).
- `VAccordion` : `<details>`/`<summary>` animé (`interpolate-size`), respecte `prefers-reduced-motion`.
- `VCarousel` : scroll-snap natif, boutons précédent/suivant accessibles, annonces `aria-live`.
- `VSplitText` (texte complet lisible par les lecteurs d'écran) et splash screen.

### Comportements globaux
- Menu mobile : ouverture/fermeture, fermeture au changement de route, scroll lock.
- Transitions de page (`pageTransition` ou View Transitions API) avec `prefers-reduced-motion`.
- Annonce du changement de route aux lecteurs d'écran + focus sur le `h1` (RGAA).
- Consentement cookies / analytics (RGPD), ou analytics sans cookie (Plausible).
- Sélecteur de langue branché sur `@nuxtjs/i18n` et `use-prismic-locale`.
- Indicateur visible du mode preview Prismic.

### Composables
- `useMediaQuery` / `useBreakpoint` (depuis `_breakpoints.module.scss`), `usePrefersReducedMotion`, `useIntersectionObserver` (reveals), `useScrollLock`, `useFocusTrap`, `useEventListener`.
- Ou ajouter `@vueuse/nuxt` plutôt que de les réécrire.

### Slices
- Citation, Galerie / Carrousel, CTA / Bannière, FAQ (accordéon), Texte + média, Embed.


# DONE
- Update Nuxt and deps
- Add nuxt-vitalizer
