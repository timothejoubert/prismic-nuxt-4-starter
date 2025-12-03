<script setup lang="ts">
import type { Content } from '@prismicio/client'
import type { EmbedField } from '@prismicio/types'

const props = defineProps(
	getSliceComponentProps<Content.AllFieldsTestSlice>(),
)


const mediaGroup = computed(() => props.slice.primary.media_group)
function isEmbedFilled(field: EmbedField) {
	return !!usePrismicEmbed(field).filledField.value
}

function isImageFilled(field: VPrismicImageField) {
	return !!usePrismicImage(field).filledField.value
}
</script>

<template>
	<VSlice
		:slice="slice"
		:class="$style.root"
	>
		<template
			v-for="(group, i) in mediaGroup"
			:key="`media-${i}`"
			:class="$style.media"
		>
			<VPrismicEmbed
				v-if="isEmbedFilled(group.embed)"
				:field="group.embed"
				:thumbnail="group.image"
			/>
			<VPrismicImage
				v-else-if="isImageFilled(group.image)"
				:field="group.image"
			/>
			<VPrismicImage
				v-else-if="isImageFilled(group.link)"
				:field="group.link"
			/>
			<VPrismicImage
				v-else-if="isImageFilled(group.responsive_image)"
				:field="group.responsive_image"
				:source-keys="['small', 'medium']"
			/>
			<VPrismicImage
				v-else-if="isImageFilled(group.media)"
				:field="group.media"
			/>
			<template v-else-if="group.link_repeatable.length">
				<VPrismicImage
					v-for="(link, i) in group.link_repeatable"
					:key="'repeatable-' + i"
					:field="link"
				/>
			</template>
			<pre v-else>{{ group }}</pre>
		</template>
	</VSlice>
</template>

<style lang="scss" module>
.root {
	display: grid;
	gap: 24px;
	grid-template-columns: repeat(auto-fit, minmax(auto, 200px));
}
</style>
