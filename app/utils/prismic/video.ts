import { getVideoMimeType } from '~/utils/media/video'
import { getFilledLinkToMedia } from './field'

export interface PrismicVideo {
    src: string
    type: string
}

/** Video file of a link to media field, undefined when the field is empty or isn't a known video format. */
export function getPrismicVideo(field: unknown): PrismicVideo | undefined {
    const media = getFilledLinkToMedia(field)
    const type = media && (getVideoMimeType(media.name) || getVideoMimeType(media.url))

    return media && type ? { src: media.url, type } : undefined
}
