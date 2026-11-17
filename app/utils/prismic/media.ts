import { getPrismicEmbed } from '~/utils/prismic/embed'
import { getPrismicImage } from '~/utils/prismic/image'
import { getPrismicVideo } from '~/utils/prismic/video'

export type PrismicMediaKind = 'image' | 'video' | 'embed'

/** What a field holds: an image, a video file or an embed (YouTube, Vimeo or another provider). */
export function getPrismicMediaKind(field: unknown): PrismicMediaKind | undefined {
    if (getPrismicImage(field)) return 'image'
    if (getPrismicVideo(field)) return 'video'
    if (getPrismicEmbed(field)) return 'embed'

    return undefined
}
