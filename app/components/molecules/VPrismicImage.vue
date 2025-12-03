<script lang="ts" setup>
import type { ImageField } from '@prismicio/client';
import type { VImgProps } from '~/components/atoms/VImg.vue'

const props = defineProps<{
	field?: VPrismicImageField
	mediaProps?: Partial<VImgProps>
	sourceKeys?: string[]
}>()

const {
	filledField: filledImage,
	componentProps: imageProps
} = usePrismicImage(props.field, props.mediaProps)

const sources = computed(() => {
	if (!props.sourceKeys) return undefined

	return props.sourceKeys.filter((key) => {
		return !!(filledImage.value as ImageField<string>)?.[key]
	}).map((key) => {
		const source = (filledImage.value as ImageField<string>)[key]
		const mediaWidth = key === 'large' ? 1024 : key === 'medium' ? 768 : 320

		return {
			...source,
			width: source?.dimensions?.width,
			height: source?.dimensions?.height,
			srcset: source?.url || '',
			media: `(min-width: ${mediaWidth}px)`,
		}
	}).filter(m => m.srcset)
})

console.log(sources.value)

</script>
<template>
	<picture v-if="sources?.length">
		<source
			v-for="(source, i) in sources"
			:key="`source-${i}`"
			:srcset="source.srcset"
			:media="source.media"
			:width="source.width"
			:height="source.height"
		/>
		<VImg v-if="filledImage" v-bind="imageProps"  />
	</picture>
	<VImg v-else-if="filledImage" v-bind="imageProps"  />
</template>
