<script setup lang="ts">
import type { MediaSliceSlice } from '~~/prismicio-types'

const props = defineProps(
	getSliceComponentProps<MediaSliceSlice>(),
)

const primary = computed(() => props.slice.primary)

const groups = computed(() => {
	const groups = primary.value.columns || []

	return groups.filter(group => {
		return (group.embed?.type === 'video' || group.image?.url)
	})
})
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
			<VPrismicMedia
				:img-field="group.image"
				:video-field="group.embed"
				:img-props="{ sizes: 'xs:100vw sm:100vw md:50vw lg:50vw hd:50vw'}"
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
