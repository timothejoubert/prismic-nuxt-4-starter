<script lang="ts" setup>
import { components } from '~/slices'
import type { AboutPageDocument } from '~~/prismicio-types'

const props = defineProps<{
    document: AboutPageDocument
}>()

const page = computed(() => props.document.data)
</script>

<template>
    <VPageHeader
        :title="page.title"
        :content="page.content"
        :image="page.image"
    />
    <SliceZone
        v-if="document.data.slices.length"
        :slices="document.data.slices"
        :components="components"
    />
</template>
