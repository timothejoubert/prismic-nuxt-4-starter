<script lang="ts" setup>
import { getAspectRatio } from '~/utils/media/aspect-ratio'

/**
 * Native video. The single place to swap in a player library (see issue #1, Video.js).
 * `background`: decorative, muted, looped video without controls; it only starts on the client
 * when the visitor doesn't prefer reduced motion, and can be paused (RGAA 13.8).
 */
const props = withDefaults(defineProps<{
    sources: { src: string, type?: string }[]
    poster?: string
    width?: number | string
    height?: number | string
    // Accessible name of a non-background video
    label?: string
    background?: boolean
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
}>(), {
    controls: true,
})

const video = useTemplateRef('video')
const isPaused = ref(true)
const reducedMotion = usePreferredReducedMotion()

onMounted(() => {
    if (props.background && reducedMotion.value !== 'reduce') video.value?.play().catch(() => {})
})

function togglePlayback() {
    if (video.value?.paused) video.value.play().catch(() => {})
    else video.value?.pause()
}
</script>

<template>
    <div
        :class="$style.root"
        :style="{ '--v-video-aspect-ratio': getAspectRatio(width, height) }"
    >
        <video
            ref="video"
            :class="$style.video"
            :poster="poster"
            :width="width"
            :height="height"
            :aria-label="background ? undefined : label"
            :aria-hidden="background || undefined"
            :autoplay="!background && autoplay"
            :muted="background || muted"
            :loop="background || loop"
            :controls="!background && controls"
            playsinline
            preload="metadata"
            @play="isPaused = false"
            @pause="isPaused = true"
        >
            <source
                v-for="source in sources"
                :key="source.src"
                :src="source.src"
                :type="source.type"
            >
        </video>
        <button
            v-if="background"
            type="button"
            :class="$style.toggle"
            @click="togglePlayback"
        >
            <VIcon :name="isPaused ? 'icon:Play' : 'icon:Pause'" />
            <span class="visually-hidden">{{ $t(isPaused ? 'media.play_background' : 'media.pause_background') }}</span>
        </button>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
}

.video {
    width: 100%;
    height: var(--v-video-height, auto);
    aspect-ratio: var(--v-video-aspect-ratio, 16 / 9);
    grid-area: 1 / 1;
    object-fit: var(--v-video-object-fit, cover);
}

.toggle {
    display: flex;
    padding: 8px;
    border: none;
    border-radius: 50%;
    margin: 12px;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    grid-area: 1 / 1;
    place-self: end start;
}
</style>
