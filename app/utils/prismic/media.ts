import {
    isFilled,
    LinkType,
    type EmbedField,
    type FilledLinkToMediaField,
    type ImageFieldImage,
    type LinkToMediaField,
} from '@prismicio/client'
import { getQuery } from 'ufo'
import { type EmbedSource, parseEmbedUrl } from '~/utils/media/embed'
import { getVideoMimeType } from '~/utils/media/video'

export interface PrismicImage {
    src: string
    /** imgix params already set by Prismic (format, compression, crop `rect`), to pass as @nuxt/image modifiers */
    modifiers: Record<string, string>
    width?: number
    height?: number
    alt: string
    copyright?: string
}

export interface PrismicVideo {
    src: string
    type: string
}

export interface PrismicEmbed {
    /** YouTube or Vimeo video, played by Video.js; undefined for any other provider */
    source?: EmbedSource
    /** Provider markup stored by Prismic, the fallback for other providers */
    html?: string
    thumbnailUrl?: string
    title?: string
    width?: number
    height?: number
}

function isObject(field: unknown): field is Record<string, unknown> {
    return !!field && typeof field === 'object'
}

function toNumber(value: unknown) {
    const number = Number(value)
    return number > 0 ? number : undefined
}

/**
 * Prismic image URLs already carry imgix params (`?auto=compress,format`, crop `rect`, `w`, `h`).
 * Split them from the URL: passed back as modifiers, they aren't lost and the imgix provider
 * doesn't append a second `?`. `w` and `h` are dropped: @nuxt/image sets its own per srcset
 * width, and both would end up in the URL. The editor's crop lives in `rect`, which is kept.
 */
export function getImgixSource(url: string) {
    const { w: _w, h: _h, ...modifiers } = getQuery(url) as Record<string, string>

    return {
        src: url.split('?')[0]!,
        modifiers,
    }
}

function getFilledLinkToMedia(field: unknown) {
    if (!isObject(field) || field.link_type !== LinkType.Media) return undefined

    return isFilled.linkToMedia(field as LinkToMediaField) ? field as FilledLinkToMediaField : undefined
}

/**
 * Image of an image field (or one of its responsive `view`s) or of a link to an image media.
 * Undefined when the field is empty or isn't an image.
 */
export function getPrismicImage(field: unknown, view?: string): PrismicImage | undefined {
    const media = getFilledLinkToMedia(field)
    if (media) {
        if (media.kind !== 'image') return undefined

        return { ...getImgixSource(media.url), width: toNumber(media.width), height: toNumber(media.height), alt: '' }
    }

    if (!isObject(field) || 'link_type' in field || 'embed_url' in field) return undefined

    const image = (view ? field[view] : field) as ImageFieldImage | undefined
    if (!isFilled.image(image)) return undefined

    return {
        ...getImgixSource(image.url),
        width: image.dimensions.width,
        height: image.dimensions.height,
        alt: image.alt || '',
        copyright: image.copyright || undefined,
    }
}

/** Video file of a link to media field, undefined when the field is empty or isn't a known video format. */
export function getPrismicVideo(field: unknown): PrismicVideo | undefined {
    const media = getFilledLinkToMedia(field)
    const type = media && (getVideoMimeType(media.name) || getVideoMimeType(media.url))

    return media && type ? { src: media.url, type } : undefined
}

/** URL of a filled link to media field (any file kind), undefined otherwise. */
export function getPrismicMediaUrl(field: unknown) {
    return getFilledLinkToMedia(field)?.url
}

function toText(value: unknown) {
    return typeof value === 'string' && value ? value : undefined
}

/**
 * Embed field: a YouTube or Vimeo `source`, or the provider's `html` for any other provider.
 * Undefined when the field is empty or carries neither.
 */
export function getPrismicEmbed(field: unknown): PrismicEmbed | undefined {
    if (!isObject(field) || !isFilled.embed(field as EmbedField)) return undefined

    // oEmbed data: every key but `embed_url` depends on the provider, hence the plain record read
    const source = parseEmbedUrl(String(field.embed_url))
    const html = toText(field.html)
    if (!source && !html) return undefined

    return {
        source,
        html: source ? undefined : html,
        thumbnailUrl: toText(field.thumbnail_url),
        title: toText(field.title),
        width: toNumber(field.width),
        height: toNumber(field.height),
    }
}
