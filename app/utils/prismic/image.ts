import { isFilled, type ImageFieldImage } from '@prismicio/client'
import type { $Img } from '@nuxt/image'
import { getQuery } from 'ufo'
import { getFilledLinkToMedia, isObject, toNumber } from './field'

export interface PrismicImage {
    src: string
    /** imgix params already set by Prismic (format, compression, crop `rect`), to pass as @nuxt/image modifiers */
    modifiers: Record<string, string>
    width?: number
    height?: number
    alt: string
    copyright?: string
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

export interface PrismicImageUrlOptions {
    width: number
    height?: number
    /** Default `crop` when `height` is set */
    fit?: string
    /** Drops Prismic's `auto=format`, which would override it */
    format?: string
    quality?: number
}

/**
 * Single imgix URL of a Prismic image (thumbnail, Open Graph image...): keeps Prismic's params (crop `rect`,
 * compression) and adds the size. Takes `useImage()`, so it can't run outside a component or composable.
 */
export function getPrismicImageUrl($img: $Img, image: PrismicImage, { width, height, fit, format, quality }: PrismicImageUrlOptions) {
    const { auto: _auto, ...withoutAuto } = image.modifiers

    return $img(image.src, {
        ...(format ? withoutAuto : image.modifiers),
        width,
        height,
        fit: fit ?? (height ? 'crop' : undefined),
        format,
        quality,
    }, { provider: 'imgix' })
}
