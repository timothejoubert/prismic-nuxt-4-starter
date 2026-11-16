<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())

const primary = computed(() => props.slice.primary)
</script>

<template>
    <VSlice
        v-if="primary.columns.length"
        :slice="slice"
        :class="$style.root"
        :spacing="primary.spacing"
    >
        <!-- The embed when filled, with the image as its poster; the image alone otherwise -->
        <VPrismicMedia
            v-for="(column, i) in primary.columns"
            :key="`media-${i}`"
            :field="column.embed"
            :poster="column.image"
            sizes="xs:100vw md:33vw"
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
