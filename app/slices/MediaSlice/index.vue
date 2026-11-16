<script setup lang="ts">
import type { Content } from '@prismicio/client'
import type { EmbedField } from '@prismicio/types'

const props = defineProps(
	getSliceComponentProps<Content.MediaSliceSlice>(),
)

const primary = computed(() => props.slice.primary)
const groups = computed(() =>  primary.value.columns || [])

function isEmbedFilled(field: EmbedField) {
	return !!usePrismicEmbed(field).filledField.value
}

const sizes = {
	width: 600,
	height: 400,
}

const imageProps = {
	...sizes,
	sizes: 'sm:100vw hd:50vw',
	modifiers: {
		fit: 'cover',
	},
}
</script>

<template>
	<VSlice
		v-if="groups?.length"
		:slice="slice"
		:class="$style.root"
		:spacing="primary.spacing"
	>
		<div
			v-for="(group, i) in groups"
			:key="`media-${i}`"
			:class="$style.media"
		>
			<VPrismicEmbed
				v-if="isEmbedFilled(group.embed)"
				:field="group.embed"
				:media-props="sizes"
				:thumbnail-props="imageProps"
				:thumbnail="group.image"
			/>
			<VPrismicImage
				v-else
				:field="group.image"
				:media-props="imageProps"
			/>
		</div>
	</VSlice>
</template>

<style lang="scss" module>
.root {
	position: relative;
	display: grid;
	gap: var(--media-slice-gap, 24px);
	grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
