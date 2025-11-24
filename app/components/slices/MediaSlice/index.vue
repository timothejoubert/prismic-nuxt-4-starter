<script setup lang="ts">
import type { MediaSliceSlice } from '~~/prismicio-types'

const props = defineProps(
	getSliceComponentProps<MediaSliceSlice>(),
)

const primary = computed(() => props.slice.primary)

const groups = computed(() =>  primary.value.columns || [])
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
				:img-props="{ sizes: 'sm:100vw hd:50vw'}"
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
