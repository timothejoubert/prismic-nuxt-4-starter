<script setup lang="ts">
import { type Content, isFilled } from '@prismicio/client'
import { getImageSizes } from '~/utils/media/image'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())

const primary = computed(() => props.slice.primary)

// One column below md, three above
const SIZES = getImageSizes({ xs: '100vw', md: '33vw' })
</script>

<template>
    <VSlice
        v-if="primary.columns.length"
        :slice="slice"
        :class="$style.root"
        :spacing="primary.spacing"
    >
        <!-- The embed when filled, with the image as its thumbnail; the image alone otherwise -->
        <VPrismicMedia
            v-for="(column, i) in primary.columns"
            :key="`media-${i}`"
            :field="isFilled.embed(column.embed) ? column.embed : column.image"
            :image-props="{ sizes: SIZES }"
            :video-props="{ poster: column.image, sizes: SIZES }"
        />
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    gap: var(--media-slice-gap, 24px);

    @include media('>=md') {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
</style>
