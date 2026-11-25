import type { EmbedPlatform } from '~/utils/media/embed'

/** Video.js media element of a YouTube or Vimeo video. Static paths: Vite can't resolve a computed specifier. */
export function loadVideojsEmbedMedia(platform: EmbedPlatform) {
    return platform === 'youtube'
        ? import('@videojs/html/media/youtube-video')
        : import('@videojs/html/media/vimeo-video')
}

/** Video.js player, skin and i18n, plus the YouTube or Vimeo media element when given a platform. */
export function loadVideojsPlayer(platform?: EmbedPlatform) {
    return Promise.all([
        import('@videojs/html/i18n'),
        import('@videojs/html/video/player'),
        import('@videojs/html/video/skin'),
        platform && loadVideojsEmbedMedia(platform),
    ])
}
