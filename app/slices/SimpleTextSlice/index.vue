<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
	getSliceComponentProps<Content.SimpleTextSliceSlice>(),
)

const sliceData = computed(() => props.slice.primary)
</script>

<template>
	<VSlice
		:slice="slice"
		:spacing="sliceData.spacing"
		:class="$style.root"
	>
		<div>Simple text Slice</div>
	</VSlice>
</template>

<style lang="scss" module>
.root {
  position: relative;
}
</style>
