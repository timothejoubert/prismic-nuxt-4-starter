<script lang="ts" setup>
import { getPrismicEmbed, getPrismicImage, getPrismicVideo } from '~/utils/prismic/media'
import type { VPrismicMediaProps } from '~/types/media'

/**
 * Renders whatever media a Prismic field holds: an image (VPrismicImage) or a video file or embed
 * (VPrismicVideo). Renders nothing when the field is empty.
 * Shared props apply to both; `imageProps` / `videoProps` take the type-specific ones and win over
 * the shared props.
 */
const props = defineProps<VPrismicMediaProps>()

const isImage = computed(() => !!getPrismicImage(props.field))
const isVideo = computed(() => !isImage.value && !!(getPrismicVideo(props.field) || getPrismicEmbed(props.field)))
</script>

<template>
    <VPrismicImage
        v-if="isImage"
        :field="field"
        :width="width"
        :height="height"
        :loading="loading"
        :alt="alt"
        v-bind="imageProps"
    />
    <VPrismicVideo
        v-else-if="isVideo"
        :field="field"
        :width="width"
        :height="height"
        :loading="loading"
        :title="title"
        v-bind="videoProps"
    />
</template>
