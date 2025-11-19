<script lang="ts" setup>
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
</template>

<!-- <style lang="scss" module></style> -->
