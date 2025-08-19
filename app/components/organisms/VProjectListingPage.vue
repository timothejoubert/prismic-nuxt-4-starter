<script lang="ts" setup>
import type { ProjectListingPageDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: ProjectListingPageDocument
}>()

const page = computed(() => props.document.data)
console.log('[VProjectListing]')

const { data: projects} = await usePrismicFetchProjects()
console.log(projects.value)
</script>

<template>
    <div>
        <UIHeader
            :title="page.title"
            :content="page.content"
        />
        <ul class="grid" :class="$style.root" v-if="projects?.length">
            <VProjectCard
                wrapper="li"
                :project="project"
                :class="$style.item"
                v-for="project in projects"
                :key="project.uid"
            />
        </ul>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    margin-block: initial;
    padding-inline: initial;
}

.item {
    grid-column: 1 / -1;
    list-style: none;

    @include media('>=md') {
        grid-column: auto / span 4;
    }

    @include media('>=lg') {
        grid-column: auto / span 6;
    }
}
</style>
