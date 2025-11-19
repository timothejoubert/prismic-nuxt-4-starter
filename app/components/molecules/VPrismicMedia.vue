<script lang="ts" setup>
import type { EmbedField } from '@prismicio/types'
import { isFilled } from "@prismicio/client";


// Convert to composable (check if field is filled before use this component)
export type VPrismicMediaField =  | VPrismicImageField

const props = defineProps<{
	imgField?: VPrismicMediaField
	imgProps?: unknown
	videoField?: EmbedField
	videoProps?: unknown
}>()

const videoProps = computed(() => {
	if(!props.videoField || !isFilled.embed(props.videoField)) return

	console.log('videoProps', props.videoField)

	return {
		// iframe: props.field.embed_url,
		embedPlatform: props.videoField?.provider_name?.toLowerCase(),
		embedId: props.videoField?.embed_url ? props.videoField.embed_url.split('/').pop() : undefined,
		...(props.videoProps || {}),
	}
})

console.log(videoProps.value)

const imgProps = computed(() => {
	if(!props.imgField || videoProps.value) return

	return usePrismicImage(props.imgField, props.imgProps)?.value
})
</script>
<template>
	<VVideoPlayer v-if="videoProps" v-bind="videoProps"/>
	<VImg v-else-if="imgProps" v-bind="imgProps"  />
</template>
