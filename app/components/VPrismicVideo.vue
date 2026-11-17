<script lang="ts" setup>
import { getAspectRatio } from '~/utils/media/aspect-ratio'
import { getEmbedPlayerSource } from '~/utils/media/embed'
import { getPrismicEmbed, getPrismicImage, getPrismicMediaUrl, getPrismicVideo } from '~/utils/prismic/media'

/**
 * Video of a Prismic field: a video file (link to media), or an embed field (YouTube and Vimeo play
 * in Video.js, other providers render the html Prismic stores). Renders nothing when the field is empty.
 *
 * Default: a server-rendered thumbnail and a play button; Video.js (or the provider html) only loads on
 * click, so nothing reaches YouTube or Vimeo before it.
 * `background`: decorative muted loop with a pause button (RGAA 13.8), started only without reduced motion.
 * A file plays in a plain `<video>`; YouTube and Vimeo load when the player nears the viewport.
 */
const props = withDefaults(defineProps<{
    field: unknown
    // `width` + `height` set the ratio. Default: the embed's dimensions, else 16 / 9.
    width?: number | string
    height?: number | string
    // Applies to the thumbnail
    loading?: 'lazy' | 'eager'
    // Names the video in the play button. Default: the embed's title.
    title?: string
    // Thumbnail: image field, link to an image, or URL. Default: the embed's thumbnail, else the file's first frame.
    poster?: unknown
    // `sizes` of the thumbnail
    sizes?: string
    background?: boolean
    // Caption files of a video file (WebVTT), from a link to media field or a URL
    tracks?: {
        field?: unknown
        src?: string
        srclang: string
        label: string
        kind?: 'captions' | 'subtitles' | 'descriptions' | 'chapters'
        default?: boolean
    }[]
}>(), {
    loading: 'lazy',
})

const video = computed(() => getPrismicVideo(props.field))
const embed = computed(() => video.value ? undefined : getPrismicEmbed(props.field))
const platform = computed(() => embed.value?.source?.platform)
const playerSource = computed(() => embed.value?.source && getEmbedPlayerSource(embed.value.source))
const isHtml = computed(() => !!embed.value?.html)
// The provider html can't autoplay muted in a loop: it always renders behind the thumbnail
const isBackground = computed(() => props.background && (!!video.value || !!platform.value))

// YouTube / Vimeo oEmbed dimensions are the thumbnail's (often 200 × 150), not the video's: 16 / 9 by default.
// The provider html sizes its iframe from the field's dimensions, so the fallback keeps them.
const ratio = computed(() => isHtml.value
    ? getAspectRatio(props.width ?? embed.value?.width, props.height ?? embed.value?.height)
    : getAspectRatio(props.width, props.height))

const $img = useImage()
const posterImage = computed(() => typeof props.poster === 'string' ? undefined : getPrismicImage(props.poster))
const posterUrl = computed(() => {
    if (typeof props.poster === 'string') return props.poster
    if (posterImage.value) {
        return $img(posterImage.value.src, {
            ...posterImage.value.modifiers,
            width: 1600,
            height: props.width && props.height ? Math.round(1600 * Number(props.height) / Number(props.width)) : undefined,
            fit: 'crop',
        }, { provider: 'imgix' })
    }

    return embed.value?.thumbnailUrl
})

const { t } = useI18n()
const label = computed(() => {
    const title = props.title || embed.value?.title

    return title ? t('media.play_title', { title }) : t('media.play')
})

const trackList = computed(() => (props.tracks || []).flatMap(({ field, src, ...track }) => {
    const url = src || getPrismicMediaUrl(field)

    return url ? [{ ...track, src: url }] : []
}))

const root = ref<HTMLElement | null>(null)
// The background <video>, <youtube-video> or <vimeo-video>: all follow the HTMLMediaElement API
const backgroundMedia = ref<HTMLMediaElement | null>(null)
const isActive = ref(false)
const isLoading = ref(false)
const isPaused = ref(true)

function loadPlayer() {
    return Promise.all([
        import('@videojs/html/i18n'),
        import('@videojs/html/video/player'),
        import('@videojs/html/video/skin'),
        platform.value === 'youtube' && import('@videojs/html/media/youtube-video'),
        platform.value === 'vimeo' && import('@videojs/html/media/vimeo-video'),
    ])
}

async function play() {
    isLoading.value = true
    if (!isHtml.value) await loadPlayer()
    isActive.value = true
    isLoading.value = false

    // The play button is gone: move the focus to the player (its container is focusable) or the iframe
    await nextTick()
    await customElements.whenDefined('video-skin').catch(() => {})
    requestAnimationFrame(() => {
        const target = root.value?.querySelector<HTMLElement>('media-container, iframe') || root.value
        target?.focus()
    })
}

// Background
const reducedMotion = usePreferredReducedMotion()

async function startBackgroundEmbed() {
    if (isActive.value || isLoading.value) return
    isLoading.value = true
    await import(platform.value === 'youtube' ? '@videojs/html/media/youtube-video' : '@videojs/html/media/vimeo-video')
    isActive.value = true
    isLoading.value = false
}

const canAutoplay = () => isBackground.value && reducedMotion.value !== 'reduce'

onMounted(() => {
    if (canAutoplay() && video.value) backgroundMedia.value?.play().catch(() => {})
})

// YouTube / Vimeo background: load the provider once the player nears the viewport
const observed = computed(() => isBackground.value && platform.value ? root.value : null)
const { stop: stopObserver } = useIntersectionObserver(observed, ([entry]) => {
    if (!entry?.isIntersecting || !canAutoplay()) return
    stopObserver()
    startBackgroundEmbed()
}, { rootMargin: '200px' })

async function toggleBackground() {
    // Reduced motion: the embed only loads when the visitor asks for it
    if (platform.value && !isActive.value) return startBackgroundEmbed()

    if (backgroundMedia.value?.paused) backgroundMedia.value.play().catch(() => {})
    else backgroundMedia.value?.pause()
}
</script>

<template>
    <div
        v-if="video || embed"
        ref="root"
        :class="$style.root"
        :style="ratio ? { '--v-prismic-video-ratio': ratio } : undefined"
        :tabindex="isActive && !isBackground ? -1 : undefined"
    >
        <template v-if="!isActive || isBackground">
            <!-- Thumbnail: the background file is its own -->
            <VPrismicImage
                v-if="posterImage && !(isBackground && video)"
                :field="poster"
                :width="width"
                :height="height"
                :sizes="sizes"
                :loading="loading"
                alt=""
                :class="$style.media"
            />
            <img
                v-else-if="posterUrl && !(isBackground && video)"
                :src="posterUrl"
                alt=""
                :loading="loading"
                :class="$style.media"
            >
            <video
                v-else-if="video && !isBackground"
                :src="`${video.src}#t=0.1`"
                :class="$style.media"
                preload="metadata"
                muted
                playsinline
                aria-hidden="true"
                tabindex="-1"
            />
        </template>

        <template v-if="isBackground">
            <video
                v-if="video"
                ref="backgroundMedia"
                :class="$style.media"
                :poster="posterUrl"
                muted
                loop
                playsinline
                preload="metadata"
                aria-hidden="true"
                @play="isPaused = false"
                @pause="isPaused = true"
            >
                <source
                    :src="video.src"
                    :type="video.type"
                >
            </video>
            <youtube-video
                v-else-if="isActive && platform === 'youtube'"
                ref="backgroundMedia"
                :source.prop="playerSource"
                :class="$style.media"
                autoplay
                muted
                loop
                playsinline
                aria-hidden="true"
                @play="isPaused = false"
                @pause="isPaused = true"
            />
            <vimeo-video
                v-else-if="isActive && platform === 'vimeo'"
                ref="backgroundMedia"
                :source.prop="playerSource"
                :class="$style.media"
                autoplay
                muted
                loop
                playsinline
                aria-hidden="true"
                @play="isPaused = false"
                @pause="isPaused = true"
            />
            <button
                type="button"
                :class="$style.toggle"
                :aria-busy="isLoading || undefined"
                @click="toggleBackground"
            >
                <VIcon :name="isPaused ? 'icon:Play' : 'icon:Pause'" />
                <span class="visually-hidden">{{ $t(isPaused ? 'media.play_background' : 'media.pause_background') }}</span>
            </button>
        </template>

        <button
            v-else-if="!isActive"
            type="button"
            :class="$style.play"
            :disabled="isLoading"
            :aria-busy="isLoading || undefined"
            @click="play"
        >
            <VIcon name="icon:Play" />
            <span class="visually-hidden">{{ label }}</span>
        </button>

        <!-- Provider markup stored by Prismic (other providers than YouTube and Vimeo), see media-components.md -->
        <!-- eslint-disable vue/no-v-html -->
        <div
            v-else-if="isHtml"
            :class="$style.html"
            v-html="embed?.html"
        />
        <!-- eslint-enable vue/no-v-html -->

        <media-i18n v-else>
            <video-player :poster="posterUrl">
                <video-skin :class="$style.media">
                    <video
                        v-if="video"
                        :src="video.src"
                        :crossorigin="trackList.length ? 'anonymous' : undefined"
                        autoplay
                        playsinline
                    >
                        <track
                            v-for="track in trackList"
                            :key="track.src"
                            :src="track.src"
                            :srclang="track.srclang"
                            :label="track.label"
                            :kind="track.kind || 'captions'"
                            :default="track.default"
                        >
                    </video>
                    <youtube-video
                        v-else-if="platform === 'youtube'"
                        :source.prop="playerSource"
                        autoplay
                        playsinline
                    />
                    <vimeo-video
                        v-else-if="platform === 'vimeo'"
                        :source.prop="playerSource"
                        autoplay
                        playsinline
                    />
                </video-skin>
            </video-player>
        </media-i18n>
    </div>
</template>

<style lang="scss" module>
.root {
    // A VPrismicImage thumbnail fills the player box
    --v-prismic-image-height: 100%;
    --v-prismic-image-object-fit: cover;

    position: relative;
    display: grid;
    overflow: hidden;
    aspect-ratio: var(--v-prismic-video-ratio, 16 / 9);
    background-color: var(--v-prismic-video-background, #000);

    // Thumbnail, media and buttons stack in the same cell
    > * {
        grid-area: 1 / 1;
    }
}

.media {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.html {
    width: 100%;
    height: 100%;

    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
}

.play {
    display: flex;
    padding: 12px;
    border: none;
    border-radius: 50%;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    font-size: 20px;
    place-self: center;

    &:disabled {
        cursor: progress;
    }
}

.toggle {
    display: flex;
    padding: 8px;
    border: none;
    border-radius: 50%;
    margin: 12px;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    place-self: end start;
}
</style>
