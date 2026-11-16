<script setup lang="ts">
import type { Content } from '@prismicio/client'

// Test slice: renders every media field type the starter supports, to check them in the slice simulator.
const props = defineProps(getSliceComponentProps<Content.AllFieldsTestSlice>())

const mediaGroup = computed(() => props.slice.primary.media_group)
const prismic = usePrismic()
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
    >
        <div
            v-for="(group, i) in mediaGroup"
            :key="`media-${i}`"
        >
            <VPrismicEmbed
                v-if="prismic.isFilled.embed(group.embed)"
                :field="group.embed"
                :thumbnail="group.image"
            />
            <VPrismicImg
                v-else-if="prismic.isFilled.image(group.image)"
                :field="group.image"
            />
            <VPrismicImg
                v-else-if="prismic.isFilled.image(group.responsive_image)"
                :field="group.responsive_image"
            />
            <VPrismicImg
                v-else-if="prismic.isFilled.linkToMedia(group.media)"
                :field="group.media"
            />
            <VPrismicImg
                v-else-if="prismic.isFilled.link(group.link)"
                :field="group.link"
            />
            <template v-else-if="group.link_repeatable.length">
                <VPrismicImg
                    v-for="(link, linkIndex) in group.link_repeatable"
                    :key="`repeatable-${linkIndex}`"
                    :field="link"
                />
            </template>
        </div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
</style>
