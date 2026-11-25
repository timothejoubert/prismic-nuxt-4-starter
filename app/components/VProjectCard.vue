<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'

const props = defineProps<{
    project: ProjectPageDocument
    headingLevel?: 'h2' | 'h3'
}>()

const data = computed(() => props.project.data)

const IMAGE_SIZES = { xs: '92vw', md: '30vw', lg: '22vw' }
</script>

<template>
    <article :class="$style.root">
        <!-- A single link, stretched over the whole card: the card is announced and focused once -->
        <component
            :is="headingLevel || 'h2'"
            :class="$style.title"
        >
            <VPrismicLink
                :to="project"
                :class="$style.link"
            >
                {{ data.title }}
            </VPrismicLink>
        </component>
        <ul
            v-if="project.tags.length"
            :class="$style.tags"
        >
            <li
                v-for="tag in project.tags"
                :key="tag"
            >
                {{ tag }}
            </li>
        </ul>
        <VText
            v-if="data.content"
            :class="$style.content"
            :content="data.content"
        />
        <!-- Decorative: the title already names the project -->
        <VPrismicImage
            v-if="data.image"
            :field="data.image"
            alt=""
            :sizes="IMAGE_SIZES"
            :width="400"
            :height="400"
            :class="$style.image"
        />
    </article>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    flex-direction: column;
}

.title {
    order: 2;
    margin-block: 10px;
}

.link {
    color: inherit;
    text-decoration: none;

    &::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    order: 3;
    padding: initial;
    margin: initial;
    gap: 6px;
    list-style: none;
}

.content {
    order: 4;
    margin-top: 10px;
}

.image {
    order: 1;
}
</style>
