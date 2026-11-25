import { getAspectRatio } from '~/utils/media/aspect-ratio'
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

interface Dimensions {
    width?: number | string
    height?: number | string
}

/**
 * CSS ratio of a video box, set at server render and never changed afterwards (no layout shift). First known of:
 * - the `width` + `height` props;
 * - the video's, when known in advance: the embed's dimensions (provider html, Vimeo; YouTube's oEmbed ones
 *   are its thumbnail's, 200 × 150), 9 / 16 for a YouTube Short;
 * - the poster image's (YouTube's own thumbnail is a 4 / 3 image with baked-in bars: never used);
 * - else undefined: the CSS default, 16 / 9.
 */
export function getVideoBoxRatio(media: PrismicVideoMedia | undefined, size: Dimensions, poster?: Dimensions) {
    const propRatio = getAspectRatio(size.width, size.height)
    if (propRatio) return propRatio

    const embed = media?.kind === 'embed' ? media.embed : undefined
    if (embed?.html || embed?.source?.platform === 'vimeo') return getAspectRatio(embed.width, embed.height)
    if (embed?.source?.vertical) return '9 / 16'

    return getAspectRatio(poster?.width, poster?.height)
}
