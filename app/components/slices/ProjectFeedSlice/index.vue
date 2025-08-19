<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
    getSliceComponentProps<Content.ProjectFeedSliceSlice>(),
)

// HYDRATION
const primary = computed(() => props.slice.primary)
</script>

<template>
    <VSlice
        ref="root"
        :slice="slice"
        :spacing="primary.spacing || 'none'"
        :class="$style.root"
    >
       <div>Project feed Slice</div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
