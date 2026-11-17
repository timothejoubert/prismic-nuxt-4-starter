// Relative: nuxt.config.ts imports this file, where the `~` alias isn't resolved
import type { EmbedPlatform } from './embed'

/** Video.js custom element tags used in templates, for Vue's `isCustomElement` (nuxt.config.ts): list each one. */
export const VIDEOJS_ELEMENTS = ['media-i18n', 'video-player', 'video-skin', 'youtube-video', 'vimeo-video']

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
