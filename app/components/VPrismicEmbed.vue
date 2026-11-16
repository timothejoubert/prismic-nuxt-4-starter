<script lang="ts" setup>
import type { EmbedField } from '@prismicio/client'
import type { VVideoPlayerProps } from '~/components/VVideoPlayer.vue'
import type { VPrismicImageField } from '~/components/VPrismicImg.vue'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'

const props = defineProps<{
    field: EmbedField
    mediaProps?: Partial<VVideoPlayerProps>
    // Optional poster: the iframe only loads once the visitor asks to play the video
    thumbnail?: VPrismicImageField
    thumbnailSizes?: string
}>()

const { filledField: filledEmbed, componentProps: embedProps } = usePrismicEmbed(() => props.field, props.mediaProps)
const hasThumbnail = computed(() => !!props.thumbnail && !!(getImageFieldFilled(props.thumbnail) || getFilledLinkToMedia(props.thumbnail)))

const isPlaying = ref(false)
</script>

<template>
    <div
        v-if="filledEmbed && hasThumbnail && thumbnail"
        :class="[$style.root, isPlaying && $style['root--playing']]"
    >
        <VPrismicImg
            :field="thumbnail"
            :sizes="thumbnailSizes"
            alt=""
            :class="$style.thumbnail"
        />
        <button
            v-if="!isPlaying"
            type="button"
            :class="$style.play"
            @click="isPlaying = true"
        >
            <VIcon name="icon:Play" />
            <span class="visually-hidden">{{ $t('video_player.play', { title: filledEmbed.title || '' }) }}</span>
        </button>
        <VVideoPlayer
            v-else
            v-bind="embedProps"
            autoplay
            :class="$style.video"
        />
    </div>
    <VVideoPlayer
        v-else-if="filledEmbed"
        v-bind="embedProps"
    />
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    place-items: center;
}

.thumbnail {
    grid-area: 1 / 1;

    .root--playing & {
        visibility: hidden;
    }
}

.play {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: none;
    border-radius: 50%;
    background-color: var(--theme-color-background, #fff);
    cursor: pointer;
    font-size: 20px;
    grid-area: 1 / 1;
}

.video {
    --v-player-video-position: absolute;
    --v-player-video-height: 100%;

    inset: 0;
}
</style>
