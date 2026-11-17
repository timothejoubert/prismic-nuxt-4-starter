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
  | `loading` | `loading` | thumbnail `loading` | thumbnail `loading` |
  | `alt` / `title` | `alt` (overrides Prismic's) | `title` | `title` |

  Default ratio: the field's dimensions for an image. For a video, the video
  sets the ratio and its thumbnail is cropped to it (`cover`); first known of
  the embed's dimensions (other-provider html, Vimeo), 9 / 16 for a YouTube
  Short, a file's own dimensions once its metadata loads (first-frame
  thumbnail, background, or the player after the click: a shift caused by the
  click, not counted as CLS), else 16 / 9. YouTube's oEmbed dimensions are its
  thumbnail's (200 × 150) and are ignored. Inside the player the video is
  never cropped (skin `contain`); a background video fills its box (`cover`).

## Types

`app/types/media.ts` is the single place for the props of the three
components; each one only calls `defineProps<VPrismic…Props>()`, and prop docs
live there as JSDoc. Add or change a prop in that file, never inline.

```text
PrismicMediaBaseProps            field, width, height, loading
├── VPrismicImageProps           + alt, sources, copyright, PrismicImageOptions (minus width/height)
├── VPrismicVideoProps           + title, poster, sizes, background, tracks (PrismicVideoTrack[])
└── VPrismicMediaProps           + alt, title (picked from the two above),
                                   imageProps / videoProps: the type-specific props of each

PrismicImageOptions              NuxtImg options: width, height, sizes, densities, fit,
│                                format, quality, preset, modifiers
└── PrismicImageSource           + media, view?, field?  (one entry of `sources`)
```

- `field` takes the real Prismic field types, as generated in
  `prismicio-types.d.ts`: `PrismicImageFieldValue` (image field, link to
  media, any link), `PrismicVideoFieldValue` (link to media, any link, embed
  field), and their union `PrismicMediaFieldValue` for `VPrismicMedia`, which
  narrows the field before handing it to the right component. `null` and
  `undefined` are accepted, so an optional field needs no `v-if`.
- `modifiers` is `PrismicImageModifiers`: imgix's own parameters, typed by
  `ImgixParams` (imgix-url-builder's `ImgixURLParams`, derived from
  `asImageSrc` in `@prismicio/client`, no extra dependency) minus `w`, `h`
  and `fit`. Spell them as imgix does (`crop: ['faces']`, `sat: -100`).
  `fit`, `format` and `quality` are typed from it too.
- `PrismicImageOptions` is shared by the `<img>` and every `<source>`, and is
  the type of the `getSource(field, options)` options given to the `#sources`
  slot.
- `imageProps` also accepts free `<img>` attributes (`fetchpriority`…).
- Runtime helpers (Prismic fields → normalized image, video and embed objects)
  stay in `app/utils/prismic/media.ts`, generic ones in `app/utils/media/`.

## VPrismicMedia

Dispatches on what the field holds: image → `VPrismicImage`; video file or
embed → `VPrismicVideo`.

- Takes the shared interface flat, plus `image-props` and `video-props` for
  type-specific props. A prop set in both places takes the object's value.
- Image and video thumbnails are separate fields in most models: pass the
  thumbnail through `video-props.poster` (see `MediaSlice`).

## VPrismicImage

Also accepts every `NuxtImg` prop (`sizes`, `densities`, `fit`, `format`,
`quality`, `modifiers`, `preset`, `preload`, `placeholder`…); the provider is
always imgix. `class` and `style` go to the outer element (`<figure>`,
`<picture>` or `<img>`), every other attribute to the `<img>`.
`fit` defaults to `cover` (imgix `fit=crop`), so `width` + `height` crop to
that ratio. Size goes through `width`/`height`, never `modifiers` (NuxtImg
lets the props override it).

Rendered element:

- `<picture>` when a `sources` prop or a `#sources` slot is given.
  - `sources`: `{ media, view? | field?, ...NuxtImg options }[]`. `view` is a
    responsive view of the main field, `field` another image field; options
    left out inherit the component's props, except `width` and `height`: each
    view or field keeps its own ratio unless given one.
  - `#sources` slot: hand-written `<source>` elements, rendered before the
    `<img>`. It receives `getSource(field, options)`, which returns the
    `srcset`, `sizes`, `width` and `height` of a field (or `options.view`)
    built like the `<img>`: `<source media="…" v-bind="getSource(field)">`.
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
- Video.js is imported on click, then playback starts (`autoplay` on the
  media) and focus moves to the player container. A browser that refuses
  the autoplay leaves the skin's play button.
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

`tracks` prop: `{ field (link to a .vtt) | src, srclang, label, kind, default }[]`,
rendered as `<track>` on video files. Site models add the field when needed.
The `<video>` then gets `crossorigin="anonymous"`: the `.vtt` host must send
CORS headers (to check on Prismic's media CDN).

### Other providers

Embeds other than YouTube and Vimeo render the `html` Prismic stores, injected
only after the click on the thumbnail, inside a box at the field's ratio. The
provider's own player then needs a second click: its markup can't be told to
autoplay. No background mode for them.

## Accessibility caveats (RGAA)

- YouTube and Vimeo captions are drawn inside the provider iframe, not by
  Video.js; YouTube caption tracks only appear once playback starts.
- Fullscreen on YouTube / Vimeo shows the provider's own controls.
- The other-provider `html` fallback carries no accessibility guarantee
  (missing iframe `title`, focus inside a cross-origin frame).
- Test keyboard, focus after the click, and screen reader announcements on
  the three kinds in the slice simulator (`AllFieldsTest`).
