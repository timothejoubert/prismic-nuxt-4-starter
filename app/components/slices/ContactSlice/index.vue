<script setup lang="ts">
import type { ContactSliceSliceDefault } from '~~/prismicio-types'

const props = defineProps(
	getSliceComponentProps<ContactSliceSliceDefault>(),
)

const primary = computed(() => props.slice.primary)
</script>

<template>
	<VSlice
		:slice="slice"
		:class="$style.root"
		class="grid"
		:spacing="primary.spacing"
	>
		<div>Contact slice</div>
	</VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
