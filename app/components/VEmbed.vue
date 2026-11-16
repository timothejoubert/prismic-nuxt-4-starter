<script lang="ts" setup>
import { type EmbedPlayerOptions, type EmbedSource, getEmbedSrc } from '~/utils/media/embed'
import { getAspectRatio } from '~/utils/media/aspect-ratio'

/**
 * YouTube or Vimeo player in an iframe. With a `poster` slot, the iframe (and its third-party
 * requests) only loads once the visitor presses play.
 */
const props = withDefaults(defineProps<EmbedPlayerOptions & {
    source: EmbedSource
    // RGAA: every iframe needs a title describing its content
    title: string
    width?: number | string
    height?: number | string
}>(), {
    // An absent boolean prop is `false` in Vue: default the player controls on explicitly
    controls: true,
})

const slots = defineSlots<{ poster?: () => unknown }>()

const isActive = ref(!slots.poster)
const iframe = useTemplateRef('iframe')

const src = computed(() => getEmbedSrc(props.source, {
    ...props,
    // Pressing the poster's play button means "play now"
    autoplay: props.autoplay || !!slots.poster,
}))

async function play() {
    isActive.value = true
    // The play button disappears: move the focus to the player instead of losing it
    await nextTick()
    iframe.value?.focus()
}
</script>

<template>
    <div
        :class="$style.root"
        :style="{ '--v-embed-aspect-ratio': getAspectRatio(width, height) }"
    >
        <iframe
            v-if="isActive"
            ref="iframe"
            :class="$style.iframe"
            :src="src"
            :title="title"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy"
        />
        <template v-else>
            <slot name="poster" />
            <button
                type="button"
                :class="$style.play"
                @click="play"
            >
                <VIcon name="icon:Play" />
                <span class="visually-hidden">{{ $t('media.play', { title }) }}</span>
            </button>
        </template>
    </div>
</template>

<style lang="scss" module>
.root {
    // A VImg poster fills the player box
    --v-img-height: 100%;
    --v-img-object-fit: cover;

    display: grid;
    aspect-ratio: var(--v-embed-aspect-ratio, 16 / 9);
    place-items: center;

    // Poster, play button and iframe stack in the same cell
    > * {
        grid-area: 1 / 1;
    }
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.play {
    display: flex;
    padding: 12px;
    border: none;
    border-radius: 50%;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    font-size: 20px;
}
</style>
