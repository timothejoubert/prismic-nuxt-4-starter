<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())

const primary = computed(() => props.slice.primary)
const columns = computed(() => primary.value.columns)
const prismic = usePrismic()

const sizes = 'xs:100vw md:33vw'
</script>

<template>
    <VSlice
        v-if="columns.length"
        :slice="slice"
        :class="$style.root"
        :spacing="primary.spacing"
    >
        <div
            v-for="(column, i) in columns"
            :key="`media-${i}`"
        >
            <VPrismicEmbed
                v-if="prismic.isFilled.embed(column.embed)"
                :field="column.embed"
                :thumbnail="column.image"
                :thumbnail-sizes="sizes"
            />
            <VPrismicImg
                v-else-if="column.image"
                :field="column.image"
                :sizes="sizes"
                :width="600"
                :height="400"
                :modifiers="{ fit: 'crop' }"
            />
        </div>
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
