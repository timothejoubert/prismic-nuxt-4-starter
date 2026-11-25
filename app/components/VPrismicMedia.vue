<script lang="ts" setup>
import { parsePrismicMedia } from '~/utils/prismic/media'
import type { PrismicImageFieldValue, PrismicVideoFieldValue, VPrismicMediaProps } from '~/types/media'

/**
 * Renders whatever media a Prismic field holds: an image (VPrismicImage) or a video file or embed
 * (VPrismicVideo). Renders nothing when the field is empty.
 * Shared props apply to both; `imageProps` / `videoProps` take the type-specific ones and win over
 * the shared props.
 */
const props = defineProps<VPrismicMediaProps>()

// The field narrowed to what each component accepts, undefined when it holds something else
const kind = computed(() => parsePrismicMedia(props.field)?.kind)
const imageField = computed(() => kind.value === 'image' ? props.field as PrismicImageFieldValue : undefined)
const videoField = computed(() => kind.value && kind.value !== 'image' ? props.field as PrismicVideoFieldValue : undefined)
</script>

<template>
    <VPrismicImage
        v-if="imageField"
        :field="imageField"
        :width="width"
        :height="height"
        :loading="loading"
        :alt="alt"
        v-bind="imageProps"
    />
    <VPrismicVideo
        v-else-if="videoField"
        :field="videoField"
        :width="width"
        :height="height"
        :loading="loading"
        :title="title"
        v-bind="videoProps"
    />
</template>
