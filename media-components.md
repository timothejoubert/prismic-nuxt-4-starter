# Media components

Spec for rendering Prismic media. Tasks and progress:
https://github.com/timothejoubert/prismic-nuxt-4-starter/issues/1

## Principles

- Prismic components only: `VPrismicMedia`, `VPrismicImage` (renamed from
  `VPrismicImg`) and `VPrismicVideo`. The generic `VImg`, `VVideo` and
  `VEmbed` are removed; field-agnostic helpers stay in `app/utils/media/`.
- Every component renders nothing when its field is empty.
- Shared interface, mapped to the native attribute of the element rendered:

  | Prop | Image | Video file | YouTube / Vimeo / other embed |
  |---|---|---|---|
  | `field` | image field, link to an image | link to a video file | embed field |
  | `width`, `height` | ratio, imgix crop | ratio, space reserved | ratio, space reserved |
  | `loading` | `loading` | `preload="none"` when `lazy` | `loading` |
  | `alt` / `title` | `alt` (overrides Prismic's) | `title` | `title` |

  Default `width` and `height` come from the field.

## VPrismicMedia

Dispatches on what the field holds: image → `VPrismicImage`; video file or
embed → `VPrismicVideo`.

- Takes the shared interface flat, plus `image-props` and `video-props` for
  type-specific props. A prop set in both places takes the object's value.

## VPrismicImage

Also accepts every `NuxtImg` prop (`sizes`, `densities`, `fit`, `format`,
`quality`, `modifiers`, `preset`, `provider`, `preload`, `placeholder`…).
`fit` defaults to `cover` (imgix `fit=crop`), so `width` + `height` crop to
that ratio. Size goes through `width`/`height`, never `modifiers` (NuxtImg
lets the props override it).

Rendered element:

- `<picture>` when a `sources` prop or a `#sources` slot is given.
  - `sources`: `{ media, view? | field?, ...NuxtImg options }[]`. `view` is a
    responsive view of the main field, `field` another image field; options
    left out inherit the component's props.
  - `#sources` slot: hand-written `<source>` elements, rendered before the
    `<img>`. It receives a helper that builds an imgix `srcset` from a field
    and NuxtImg options, so they keep the same image handling.
- `<figure>` when the field has a `copyright` or a `#caption` slot is given
  (may wrap a `<picture>`). `<figcaption>`: caption slot first, then the
  copyright in a `<small>`, prefixed with `©` from i18n. A `copyright` prop
  overrides the field's; `copyright=""` hides it.
- `<img>` otherwise.

## VPrismicVideo

Player: Video.js 10 (`@videojs/html`, `@videojs/youtube-video`,
`@videojs/vimeo-video`), pinned to an exact version since v10 moves fast.
Web components, client side only, declared in Nuxt's
`vue.compilerOptions.isCustomElement`. Same controls for files, YouTube and
Vimeo; default skin, themed per site through its CSS custom properties.

### Facade (default)

- Server-rendered thumbnail at the `width`/`height` ratio (no layout shift)
  with a real `<button>` to play.
- Video.js is imported on click, then playback starts and focus moves to the
  player.
- Thumbnail source, first available:
  1. `poster` prop: Prismic image field (through imgix at the ratio) or URL;
  2. embed field `thumbnail_url` (YouTube / Vimeo / other);
  3. video file: `<video preload="metadata">`, which shows its first frame.
- Privacy: `youtube-nocookie.com`, Vimeo `dnt`; nothing reaches the provider
  before the click.

### Background mode (`background` prop)

Autoplay, muted, loop, `playsinline`, a pause button, and only when
`prefers-reduced-motion` is not set (poster only otherwise).

- Video file: plain native `<video>`, no Video.js (no controls to show).
- YouTube / Vimeo: Video.js loaded when the player nears the viewport, still
  through nocookie / `dnt`. Accepted trade-off: the provider is contacted on
  display, without a click.

### Captions

`tracks` prop: `{ field (link to a .vtt) | src, srclang, label, kind }[]`,
rendered as `<track>` on video files. Site models add the field when needed.

### Other providers

Embeds other than YouTube and Vimeo render the `html` Prismic stores, injected
only after the click on the thumbnail, inside a box at the field's ratio.

## Accessibility caveats (RGAA)

- YouTube and Vimeo captions are drawn inside the provider iframe, not by
  Video.js; YouTube caption tracks only appear once playback starts.
- Fullscreen on YouTube / Vimeo shows the provider's own controls.
- The other-provider `html` fallback carries no accessibility guarantee
  (missing iframe `title`, focus inside a cross-origin frame).
- Test keyboard, focus after the click, and screen reader announcements on
  the three kinds in the slice simulator (`AllFieldsTest`).
