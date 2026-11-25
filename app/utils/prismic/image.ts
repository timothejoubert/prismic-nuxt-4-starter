import { isFilled, type ImageFieldImage } from '@prismicio/client'
import { getQuery } from 'ufo'
import { getFilledLinkToMedia, isObject, toNumber } from '~/utils/prismic/field'
import { getHeightForWidth } from '~/utils/media/aspect-ratio'
import type { PrismicImageOptions } from '~/types/media'

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

export type PrismicImageResolveOptions = Pick<PrismicImageOptions, 'width' | 'height' | 'fit' | 'format' | 'quality' | 'modifiers'>

export interface ResolvedPrismicImage {
    src: string
    width?: number
    height?: number
    /**
     * @nuxt/image modifiers. `width`, `height`, `fit`, `format` and `quality` use @nuxt/image's names (imgix's
     * `fm` and `q` are renamed): NuxtImg rewrites those five from its props, so pass them as props too.
     */
    modifiers: Record<string, unknown> & Pick<PrismicImageOptions, 'fit' | 'format' | 'quality'>
}

/** Positive number of a prop value, undefined otherwise (`''`, `0`, `'abc'`). */
function toDimension(value?: number | string) {
    const number = Number(value)

    return number > 0 ? number : undefined
}

/** imgix params with `fm` and `q` under @nuxt/image's names, so one key carries each value. */
function toNuxtImageNames({ fm, q, ...params }: Record<string, unknown> = {}) {
    return { ...params, format: fm as PrismicImageOptions['format'], quality: q === undefined ? undefined : Number(q) }
}

/** Prismic's `auto` (`'compress,format'`) without `format`: auto=format would win over `fm` and serve AVIF anyway. */
function withoutAutoFormat(auto: unknown) {
    const values = (Array.isArray(auto) ? auto : String(auto).split(',')).filter(value => value && value !== 'format')

    return values.length ? values.join(',') : undefined
}

function withoutUndefined<T extends Record<string, unknown>>(object: T) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined)) as T
}

/**
 * The size and imgix params of a Prismic image, the one recipe behind every URL of it (`<img>`, `<source>`,
 * video poster, Open Graph image). Pure: the caller hands the result to NuxtImg, `$img.getSizes` or `$img`.
 * - Size: `width` + `height` crop to that ratio; one of them alone keeps the image's ratio; none keeps its size.
 * - `fit`: default `cover` (imgix `crop`).
 * - `format`: sets `fm` and drops `format` from Prismic's `auto`, keeping `compress`.
 * - Merge order: Prismic's URL params, then the named options, then `modifiers`, which win.
 */
export function resolvePrismicImage(image: PrismicImage, options: PrismicImageResolveOptions = {}): ResolvedPrismicImage {
    const optionWidth = toDimension(options.width)
    const optionHeight = toDimension(options.height)
    const width = optionWidth
      ?? (optionHeight ? getHeightForWidth(optionHeight, image.height, image.width) : image.width)
    const height = optionHeight
      ?? (optionWidth ? getHeightForWidth(optionWidth, image.width, image.height) : image.height)

    const modifiers: ResolvedPrismicImage['modifiers'] = {
        ...withoutUndefined(toNuxtImageNames(image.modifiers)),
        ...withoutUndefined({ width, height, fit: options.fit ?? 'cover', format: options.format, quality: options.quality }),
        ...withoutUndefined(toNuxtImageNames(options.modifiers)),
    }

    if (modifiers.format && modifiers.auto) {
        const auto = withoutAutoFormat(modifiers.auto)
        if (auto) modifiers.auto = auto
        else delete modifiers.auto
    }

    return { src: image.src, width, height, modifiers }
}
