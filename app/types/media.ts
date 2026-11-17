// Props of the Prismic media components, see media-components.md
import type { asImageSrc, EmbedField, ImageFieldImage, LinkField, LinkToMediaField } from '@prismicio/client'

/** Every imgix URL parameter, typed (imgix-url-builder's `ImgixURLParams`, through @prismicio/client). */
export type ImgixParams = NonNullable<Parameters<typeof asImageSrc>[1]>

/** imgix params for `modifiers`, spelled as imgix spells them. Size and ratio go through `width`, `height` and `fit`. */
export type PrismicImageModifiers = Omit<ImgixParams, 'w' | 'h' | 'fit'>

/**
 * Field values each component accepts, as generated in prismicio-types.d.ts. `LinkField` covers a
 * link allowing any target: only its media variant renders. An image field with responsive views
 * (`ImageField<'small'>`) is an `ImageFieldImage` plus its views.
 */
type Empty = null | undefined
export type PrismicImageFieldValue = ImageFieldImage | LinkToMediaField | LinkField | Empty
export type PrismicVideoFieldValue = LinkToMediaField | LinkField | EmbedField | Empty
export type PrismicMediaFieldValue = PrismicImageFieldValue | PrismicVideoFieldValue

/** Shared by VPrismicMedia, VPrismicImage and VPrismicVideo. */
export interface PrismicMediaBaseProps<Field = PrismicMediaFieldValue> {
    field: Field
    /** With `height`, sets the ratio: an image is cropped to it, a video box reserves it. */
    width?: number | string
    height?: number | string
    /** Image `loading`; for a video, its thumbnail's. */
    loading?: 'lazy' | 'eager'
}

/** NuxtImg options of an image, and of each `<source>` of a `<picture>`. */
export interface PrismicImageOptions {
    width?: number | string
    height?: number | string
    sizes?: string
    densities?: string
    /**
     * Default `cover` (imgix `fit=crop`): `width` + `height` crop to that ratio. NuxtImg names
     * (`cover`, `contain`, `fill`, `inside`, `outside`) are mapped to imgix's; imgix values pass as is.
     */
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside' | ImgixParams['fit']
    /** imgix `fm` */
    format?: ImgixParams['fm']
    /** imgix `q` */
    quality?: number
    preset?: string
    /**
     * Extra imgix params (`crop: ['faces']`, `sat: -100`...), merged over the ones Prismic puts in the URL.
     * Size and ratio go through `width`, `height` and `fit`: NuxtImg lets them override modifiers.
     */
    modifiers?: PrismicImageModifiers
}

/**
 * One `<source>` of a `<picture>` (art direction): which image to show when `media` matches.
 * @example
 * // The `mobile` view of the field below 768px, the main image above
 * { view: 'mobile', media: '(width < 768px)' }
 * // Another image field below 768px
 * { field: data.mobile_image, media: '(width < 768px)' }
 */
export interface PrismicImageSource extends PrismicImageOptions {
    media: string
    /**
     * Name of a responsive view of the field, cropped on its own in Prismic: `view: 'mobile'` reads
     * `field.mobile`. Keeps its own ratio.
     */
    view?: string
    /** Another image field (or link to an image) instead of the component's; combines with `view`. */
    field?: PrismicImageFieldValue
}

export interface VPrismicImageProps extends PrismicMediaBaseProps<PrismicImageFieldValue>, Omit<PrismicImageOptions, 'width' | 'height'> {
    /** Overrides the alt text written in Prismic; `""` for a decorative image. */
    alt?: string
    /**
     * `<source>` list. Options left out inherit the component's, except `width` and `height`:
     * each view or field keeps its own ratio unless given one.
     */
    sources?: PrismicImageSource[]
    /** Overrides the field's copyright; `""` hides it. */
    copyright?: string
}

export interface PrismicVideoTrack {
    /** Link to media field holding a WebVTT file */
    field?: LinkToMediaField | LinkField
    src?: string
    srclang: string
    label: string
    kind?: 'captions' | 'subtitles' | 'descriptions' | 'chapters'
    default?: boolean
}

export interface VPrismicVideoProps extends PrismicMediaBaseProps<PrismicVideoFieldValue> {
    /** Names the video in the play button. Default: the embed's title. */
    title?: string
    /** Thumbnail: image field, link to an image, or URL. Default: the embed's thumbnail, else the file's first frame. */
    poster?: PrismicImageFieldValue | string
    /** `sizes` of the thumbnail */
    sizes?: string
    background?: boolean
    /** Caption files of a video file */
    tracks?: PrismicVideoTrack[]
}

type TypeSpecificProps<Props> = Partial<Omit<Props, keyof PrismicMediaBaseProps>>

export interface VPrismicMediaProps extends PrismicMediaBaseProps, Pick<VPrismicImageProps, 'alt'>, Pick<VPrismicVideoProps, 'title'> {
    /** VPrismicImage props (sizes, sources, copyright...) and `<img>` attributes; they win over the shared props. */
    imageProps?: TypeSpecificProps<VPrismicImageProps> & Record<string, unknown>
    /** VPrismicVideo props (poster, background, tracks...); they win over the shared props. */
    videoProps?: TypeSpecificProps<VPrismicVideoProps>
}
