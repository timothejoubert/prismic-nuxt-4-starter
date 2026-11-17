import { isFilled, type EmbedField } from '@prismicio/client'
import { type EmbedSource, parseEmbedUrl } from '~/utils/media/embed'
import { isObject, toNumber, toText } from './field'

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
