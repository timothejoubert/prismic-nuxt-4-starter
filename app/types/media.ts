// Props of the Prismic media components, see media-components.md

/** Shared by VPrismicMedia, VPrismicImage and VPrismicVideo. */
export interface PrismicMediaBaseProps {
    field: unknown
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
    /** Default `cover` (imgix `fit=crop`): `width` + `height` crop to that ratio. */
    fit?: string
    format?: string
    quality?: number | string
    preset?: string
    /**
     * Extra imgix params (`crop: 'faces'`...), merged over the ones Prismic puts in the URL.
     * Size and ratio go through `width`, `height` and `fit`: NuxtImg lets them override modifiers.
     */
    modifiers?: Record<string, string | number>
}

export interface PrismicImageSource extends PrismicImageOptions {
    media: string
    /** Responsive view of the component's field */
    view?: string
    /** Another image field (or link to an image) */
    field?: unknown
}

export interface VPrismicImageProps extends PrismicMediaBaseProps, Omit<PrismicImageOptions, 'width' | 'height'> {
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
    field?: unknown
    src?: string
    srclang: string
    label: string
    kind?: 'captions' | 'subtitles' | 'descriptions' | 'chapters'
    default?: boolean
}

export interface VPrismicVideoProps extends PrismicMediaBaseProps {
    /** Names the video in the play button. Default: the embed's title. */
    title?: string
    /** Thumbnail: image field, link to an image, or URL. Default: the embed's thumbnail, else the file's first frame. */
    poster?: unknown
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
