<script lang="ts" setup>
import { useFetchPage } from '#imports'

const { document, documentType } = await useFetchPage(undefined)

// Index and project pages should use the same layout
const { data: projects } = await usePrismicFetchProjects(true)
</script>

<template>
    <div :class="$style.root">
        <h1>Page title: {{ document?.data?.title || 'unknown' }} | {{ documentType }}</h1>
        <VProjectListing
            v-if="projects?.length"
            :projects="projects"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
