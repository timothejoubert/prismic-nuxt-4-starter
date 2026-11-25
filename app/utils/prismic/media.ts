import { getPrismicEmbed, type PrismicEmbed } from '~/utils/prismic/embed'
import { getPrismicImage, type PrismicImage } from '~/utils/prismic/image'
import { getPrismicVideo, type PrismicVideo } from '~/utils/prismic/video'

export type PrismicVideoMedia = { kind: 'video', video: PrismicVideo } | { kind: 'embed', embed: PrismicEmbed }
export type PrismicMedia = { kind: 'image', image: PrismicImage } | PrismicVideoMedia

/** What a video field holds, a video file before an embed. Undefined when it holds neither. */
export function parsePrismicVideoMedia(field: unknown): PrismicVideoMedia | undefined {
    const video = getPrismicVideo(field)
    if (video) return { kind: 'video', video }

    const embed = getPrismicEmbed(field)

    return embed ? { kind: 'embed', embed } : undefined
}

/**
 * What a media field holds, parsed once: an image, then a video file, then an embed (YouTube, Vimeo or
 * another provider). The single place for that precedence. Undefined when the field is empty.
 */
export function parsePrismicMedia(field: unknown): PrismicMedia | undefined {
    const image = getPrismicImage(field)

    return image ? { kind: 'image', image } : parsePrismicVideoMedia(field)
}
