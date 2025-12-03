<script lang="ts" setup>
import type { VTextContent } from '~/components/atoms/VText.vue'

const props = defineProps<{
	title: string
	content?: VTextContent
	image?: VPrismicImageField
}>()
</script>

<template>
	<section class="grid-container" :class="$style.root">
		<h1>{{ title }}</h1>
		<VText
			v-if="content"
			:content="content"
		/>
		<VPrismicImage
			:media-props="{
				width: 1000,
				height: 600,
				modifiers: { fit: 'crop'}
			}"
			:field="image"
		/>
	</section>
</template>

<style lang="scss" module>
.root {
	margin-block: 42px;
}
</style>
