export type EmbedPlatform = 'youtube' | 'vimeo'

export interface EmbedSource {
    platform: EmbedPlatform
    id: string
    // Privacy hash of an unlisted Vimeo video, required to play it
    hash?: string
    // YouTube Shorts are vertical (9 / 16)
    vertical?: boolean
}

// watch?v=, youtu.be/, /embed/, /shorts/ and /live/ URLs
const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
// vimeo.com/123, vimeo.com/123/hash, player.vimeo.com/video/123?h=hash, channel and group URLs
const VIMEO_ID = /vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)(?:\/([\da-f]+))?/
const VIMEO_HASH_PARAM = /[?&]h=([\da-f]+)/

/** Platform and video id of a YouTube or Vimeo URL, undefined for any other URL. */
export function parseEmbedUrl(url: string): EmbedSource | undefined {
    const youtubeId = url.match(YOUTUBE_ID)?.[1]
    if (youtubeId) return { platform: 'youtube', id: youtubeId, vertical: url.includes('/shorts/') || undefined }

    const vimeo = url.match(VIMEO_ID)
    if (vimeo?.[1]) return { platform: 'vimeo', id: vimeo[1], hash: vimeo[2] || url.match(VIMEO_HASH_PARAM)?.[1] }

    return undefined
}

/**
 * Structured source for Video.js' `<youtube-video>` / `<vimeo-video>` (`source` property), with
 * privacy-friendly defaults: no-cookie YouTube domain, Vimeo do-not-track.
 */
export function getEmbedPlayerSource({ platform, id, hash }: EmbedSource) {
    if (platform === 'youtube') {
        return {
            src: `https://www.youtube-nocookie.com/embed/${id}`,
            engine: { youtube: { rel: 0, iv_load_policy: 3 } },
        }
    }

    return {
        src: `https://vimeo.com/${id}${hash ? `/${hash}` : ''}`,
        engine: { vimeo: { dnt: true } },
    }
}
