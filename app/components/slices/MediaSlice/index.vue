<script setup lang="ts">
import type { MediaSliceSlice } from '~~/prismicio-types'

const props = defineProps(
	getSliceComponentProps<MediaSliceSlice>(),
)

const primary = computed(() => props.slice.primary)

const medias = computed(() => {
	const mediaGroups = primary.value.columns || []

	return mediaGroups.reduce((acc, mediaGroup) => {
		const imgProps = usePrismicImage(mediaGroup.image)

		if (imgProps) {
			acc.push({ type: 'img', props: imgProps.value })
		}

		return acc
	}, [])
})
</script>

<template>
	<VSlice
		v-if="medias?.length"
		:slice="slice"
		:class="$style.root"
		:spacing="primary.spacing"
	>
		<div
			v-for="(media, i) in medias"
			:key="`media-${i}`"
			:class="$style.media"
		>
			<VImg
				v-if="media.type === 'img'"
				sizes="xs:100vw sm:100vw md:50vw lg:50vw hd:50vw"
				v-bind="media.props"
			/>
		</div>
	</VSlice>
</template>

<style lang="scss" module>
.root {
	position: relative;
	display: flex;
	gap: var(--media-slice-gap, 24px);
}
</style>
