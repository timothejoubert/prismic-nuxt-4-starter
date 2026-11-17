<script lang="ts" setup>
import { getPrismicEmbed, getPrismicImage, getPrismicVideo } from '~/utils/prismic/media'

/**
 * Renders whatever media a Prismic field holds: an image (VPrismicImage) or a video file or embed
 * (VPrismicVideo). Renders nothing when the field is empty.
 * Shared props apply to both; `imageProps` / `videoProps` take the type-specific ones and win over
 * the shared props.
 */
const props = defineProps<{
    field: unknown
    width?: number | string
    height?: number | string
    loading?: 'lazy' | 'eager'
    // Image alt text, `""` for a decorative image
    alt?: string
    // Video title, named by the play button
    title?: string
    // VPrismicImage props (sizes, sources, copyright...)
    imageProps?: Record<string, unknown>
    // VPrismicVideo props (poster, background, tracks...)
    videoProps?: Record<string, unknown>
}>()

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
