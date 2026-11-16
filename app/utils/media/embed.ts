export type EmbedPlatform = 'youtube' | 'vimeo'

export interface EmbedSource {
    platform: EmbedPlatform
    id: string
    // Privacy hash of an unlisted Vimeo video, required to play it
    hash?: string
}

export interface EmbedPlayerOptions {
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
}

// watch?v=, youtu.be/, /embed/, /shorts/ and /live/ URLs
const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
// vimeo.com/123, vimeo.com/123/hash, player.vimeo.com/video/123?h=hash, channel and group URLs
const VIMEO_ID = /vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)(?:\/([\da-f]+))?/
const VIMEO_HASH_PARAM = /[?&]h=([\da-f]+)/

/** Platform and video id of a YouTube or Vimeo URL, undefined for any other URL. */
export function parseEmbedUrl(url: string): EmbedSource | undefined {
    const youtubeId = url.match(YOUTUBE_ID)?.[1]
    if (youtubeId) return { platform: 'youtube', id: youtubeId }

    const vimeo = url.match(VIMEO_ID)
    if (vimeo?.[1]) return { platform: 'vimeo', id: vimeo[1], hash: vimeo[2] || url.match(VIMEO_HASH_PARAM)?.[1] }

    return undefined
}

function flag(value: boolean | undefined) {
    return value ? '1' : '0'
}

/** Player URL of an embed, with privacy-friendly defaults (no-cookie YouTube domain, Vimeo do-not-track). */
export function getEmbedSrc({ platform, id, hash }: EmbedSource, { autoplay, muted, loop, controls = true }: EmbedPlayerOptions = {}) {
    if (platform === 'youtube') {
        const params = new URLSearchParams({
            autoplay: flag(autoplay),
            mute: flag(muted),
            controls: flag(controls),
            loop: flag(loop),
            playsinline: '1',
            rel: '0',
            iv_load_policy: '3',
        })
        // YouTube only loops a video that is also its own playlist
        if (loop) params.set('playlist', id)

        return `https://www.youtube-nocookie.com/embed/${id}?${params}`
    }

    const params = new URLSearchParams({
        autoplay: flag(autoplay),
        muted: flag(muted),
        controls: flag(controls),
        loop: flag(loop),
        dnt: '1',
        byline: '0',
        portrait: '0',
        title: '0',
    })
    if (hash) params.set('h', hash)

    return `https://player.vimeo.com/video/${id}?${params}`
}
