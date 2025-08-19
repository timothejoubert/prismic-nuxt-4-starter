<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
    getSliceComponentProps<Content.ContentSliceSlice>(),
)

const primary = computed(() => props.slice.primary)

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root]
})
</script>

<template>
    <VSlice
        :slice="slice"
        tag="div"
        :class="rootClasses"
        :spacing="primary.spacing"
    >
        <div>Media Slice</div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
