<script lang="ts" setup>
import { getHeightForWidth } from '~/utils/media/aspect-ratio'
import { getEmbedPlayerSource } from '~/utils/media/embed'
import { loadVideojsEmbedMedia, loadVideojsPlayer } from '~/utils/media/videojs'
import { getPrismicMediaUrl } from '~/utils/prismic/field'
import { getPrismicImage, resolvePrismicImage } from '~/utils/prismic/image'
import { getVideoBoxRatio, parsePrismicVideoMedia } from '~/utils/prismic/media'
import type { VPrismicVideoProps } from '~/types/media'

/**
 * Video of a Prismic field: a video file (link to media), or an embed field (YouTube and Vimeo play
 * in Video.js, other providers render the html Prismic stores). Renders nothing when the field is empty.
 *
 * Default: a server-rendered thumbnail and a play button; Video.js (or the provider html) only loads on
 * click. Before it, only the embed thumbnail image comes from the provider (a `poster` avoids it).
 * `background`: decorative muted loop with a pause button (RGAA 13.8), started even with reduced motion.
 * A file plays in a plain `<video>`; YouTube and Vimeo load when the player nears the viewport.
 */
const props = withDefaults(defineProps<VPrismicVideoProps>(), {
    loading: 'lazy',
})

const media = computed(() => parsePrismicVideoMedia(props.field))
const video = computed(() => media.value?.kind === 'video' ? media.value.video : undefined)
const embed = computed(() => media.value?.kind === 'embed' ? media.value.embed : undefined)
const platform = computed(() => embed.value?.source?.platform)
const playerSource = computed(() => embed.value?.source && getEmbedPlayerSource(embed.value.source))
const isHtml = computed(() => !!embed.value?.html)
// The provider html can't autoplay muted in a loop: it always renders behind the thumbnail
const isBackground = computed(() => props.background && (!!video.value || !!platform.value))

const $img = useImage()
const posterField = computed(() => typeof props.poster === 'string' ? undefined : props.poster)
const posterImage = computed(() => getPrismicImage(posterField.value))

// A video of another ratio plays whole inside the box (skin `contain`), a background one fills it (`cover`)
const ratio = computed(() => getVideoBoxRatio(media.value, props, posterImage.value))
const posterUrl = computed(() => {
    if (typeof props.poster === 'string') return props.poster
    if (posterImage.value) {
        const { src, modifiers } = resolvePrismicImage(posterImage.value, {
            width: 1600,
            height: getHeightForWidth(1600, props.width, props.height),
        })

        return $img(src, modifiers, { provider: 'imgix' })
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
// Video.js poster after the click: the thumbnail's srcset candidate, already downloaded, else posterUrl
const activePoster = ref<string>()
const isLoading = ref(false)
const isPaused = ref(true)

async function play() {
    // aria-disabled, not disabled: a disabled button would drop the focus to <body> while loading
    if (isLoading.value) return
    isLoading.value = true
    activePoster.value = root.value?.querySelector('img')?.currentSrc || posterUrl.value
    if (!isHtml.value) await loadVideojsPlayer(platform.value)
    isActive.value = true
    isLoading.value = false

    // The play button is gone: move the focus to the player (its container is focusable) or the iframe
    await nextTick()
    await customElements.whenDefined('video-skin').catch(() => {})
    requestAnimationFrame(() => {
        // The packaged skin renders its focusable container (role="group") in its shadow root
        const skin = root.value?.querySelector('video-skin')
        const target = skin?.shadowRoot?.querySelector<HTMLElement>('media-container')
          || root.value?.querySelector<HTMLElement>('media-container, iframe')
          || root.value
        target?.focus()
    })
}

// Background: the pause button is the RGAA 13.8 control, so reduced motion doesn't block autoplay
async function startBackgroundEmbed() {
    if (isActive.value || isLoading.value) return
    isLoading.value = true
    if (platform.value) await loadVideojsEmbedMedia(platform.value)
    isActive.value = true
    isLoading.value = false
}

onMounted(() => {
    if (isBackground.value && video.value) backgroundMedia.value?.play().catch(() => {})
})

// YouTube / Vimeo background: load the provider once the player nears the viewport
const observed = computed(() => isBackground.value && platform.value ? root.value : null)
const { stop: stopObserver } = useIntersectionObserver(observed, ([entry]) => {
    if (!entry?.isIntersecting) return
    stopObserver()
    startBackgroundEmbed()
}, { rootMargin: '200px' })

async function toggleBackground() {
    // Clicked before the player neared the viewport: load the embed now
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
            <!-- Thumbnail (a background file is its own). copyright="": a <figure> would break the player box -->
            <VPrismicImage
                v-if="posterImage && !(isBackground && video)"
                :field="posterField"
                :width="width"
                :height="height"
                :sizes="sizes"
                :loading="loading"
                alt=""
                copyright=""
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
                :class="[$style.media, $style.contain]"
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
            :aria-disabled="isLoading || undefined"
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
            <video-player :poster="activePoster">
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
                        :class="$style.media"
                        autoplay
                        playsinline
                    />
                    <vimeo-video
                        v-else-if="platform === 'vimeo'"
                        :source.prop="playerSource"
                        :class="$style.media"
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

    // Video.js skin theme, inherited through its shadow root (other variables: media-components.md)
    --media-accent-color: var(--theme-color-primary);
    --media-accent-text-color: var(--theme-color-on-primary);

    position: relative;
    display: grid;
    overflow: hidden;
    aspect-ratio: var(--v-prismic-video-ratio, 16 / 9);
    background-color: var(--v-prismic-video-background, #000);

    // One cell the size of the box: a thumbnail of another ratio must not stretch the row (it would
    // offset the centered play button), it is cropped by object-fit instead
    grid-template: minmax(0, 1fr) / minmax(0, 1fr);

    // Thumbnail, media and buttons stack in the same cell
    > * {
        grid-area: 1 / 1;
    }
}

// Also stretches the player's <youtube-video> / <vimeo-video>: the skin only sizes a <video>, and
// their host defaults to a 300 × 150 inline-block
.media {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

// The first frame of a file of unknown ratio: shown whole, like the player will
.contain {
    object-fit: contain;
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

    &[aria-disabled='true'] {
        cursor: progress;
    }
}

.toggle {
    display: flex;
    width: 1.5em;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    margin: 12px;
    aspect-ratio: 1;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    font-size: 16px;
    place-self: end start;
}
</style>
