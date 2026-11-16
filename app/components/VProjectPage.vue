<script lang="ts" setup>
import { components } from '~/slices'
import type { ProjectPageDocument } from '~~/prismicio-types'
import { prismicRouteByName } from '~~/shared/prismic-schema'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const project = computed(() => props.document.data)
const tags = computed(() => props.document.tags)
</script>

<template>
    <article :class="$style.root">
        <h1>{{ project.title }}</h1>
        <VPrismicLink :to="prismicRouteByName.projects">
            {{ $t('project_page.back_to_listing') }}
        </VPrismicLink>
        <ul
            v-if="tags.length"
            :class="$style.tags"
        >
            <li
                v-for="tag in tags"
                :key="tag"
            >
                {{ tag }}
            </li>
        </ul>
        <VTime
            :date="project.creation_date"
            format="full"
        />
        <VText
            v-if="project.content"
            :content="project.content"
        />
        <VText
            v-if="project.credits"
            :content="project.credits"
        />
        <VPrismicImg
            v-if="project.image"
            :field="project.image"
            sizes="xs:100vw lg:80vw"
        />
        <SliceZone
            v-if="project.slices.length"
            :slices="project.slices"
            :components="components"
        />
    </article>
</template>

<style lang="scss" module>
.root {
    position: relative;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: initial;
    margin: initial;
    gap: 6px;
    list-style: none;
}
</style>
