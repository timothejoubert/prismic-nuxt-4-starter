<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types';
import type { VWrapperProps } from '~/components/atoms/VWrapper.vue'

const props = defineProps<{
    project: ProjectPageDocument
} & VWrapperProps>()
</script>

<template>
    <UICard
        :wrapper="wrapper"
        :title="project.data.title"
        :content="project.data.date"
        :image="project.data.image"
        :tags="project.tags"
        :url="project.url"
    />
</template>

<style lang="scss" module>


</style>
