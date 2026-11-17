<script setup lang="ts">
import type { Content } from '@prismicio/client'

// Test slice: renders every media field type the starter supports, to check them in the slice simulator.
const props = defineProps(getSliceComponentProps<Content.AllFieldsTestSlice>())

const mediaGroup = computed(() => props.slice.primary.media_group)
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
    >
        <div
            v-for="(group, i) in mediaGroup"
            :key="`media-${i}`"
            :class="$style.group"
        >
            <VPrismicMedia
                :field="group.embed"
                :video-props="{ poster: group.image }"
            />
            <VPrismicMedia :field="group.image" />
            <VPrismicImage
                :field="group.responsive_image"
                :sources="[{ view: 'small', media: '(width < 768px)' }, { view: 'medium', media: '(width < 1024px)' }]"
            />
            <VPrismicMedia
                :field="group.media"
                :video-props="{ background: true }"
            />
            <VPrismicMedia :field="group.media" />
            <VPrismicMedia :field="group.link" />
            <VPrismicMedia
                v-for="(link, linkIndex) in group.link_repeatable"
                :key="`repeatable-${linkIndex}`"
                :field="link"
            />
        </div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    display: grid;
    gap: 24px;
}

.group {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
</style>
