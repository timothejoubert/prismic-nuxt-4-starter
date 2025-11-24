<script lang="ts" setup>
import type { VTextContent } from '~/components/atoms/VText.vue'

const props = defineProps<{
	title: string
	content?: VTextContent
	image?: VPrismicImageField
}>()

const imgProps = usePrismicImage(props.image, { width: 1000, height: 600, modifiers: { fit: 'crop' } })
</script>

<template>
	<section class="grid-container" :class="$style.root">
		<h1>{{ title }}</h1>
		<VText
			v-if="content"
			:content="content"
		/>
		<VImg
			v-if="imgProps"
			v-bind="imgProps"
		/>
	</section>
</template>

<style lang="scss" module>
.root {
	margin-block: 42px;
}
</style>
