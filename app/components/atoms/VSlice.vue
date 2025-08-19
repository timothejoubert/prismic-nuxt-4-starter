<script  lang="ts" setup>
import type { SharedSlice } from '@prismicio/types'

defineProps<{
    slice?: SharedSlice
    tag?: string
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none'
}>()
</script>

<template>
    <component
        :is="tag || 'section'"
        :class="[$style.root, $style[`root--spacing-block-${spacing}`]]"
        :data-slice-type="slice?.slice_type"
        :data-slice-variation="slice?.variation"
    >
        <slot />
    </component>
</template>

<style lang="scss" module>
@use "assets/scss/mixins/property-fluid" as *;
@use "assets/scss/functions/fluid" as *;

.root {
    margin-block: var(--v-slice-padding-block);

    &--spacing-block-xs {
		--v-slice-padding-block: #{fluid((xs: 10, xl: 24))};
    }

    &--spacing-block-sm {
        --v-slice-padding-block: #{fluid((xs: 24, xl: 48))};
    }

    &--spacing-block-md {
        --v-slice-padding-block: #{fluid((xs: 48, xl: 96))};
    }

    &--spacing-block-lg {
        --v-slice-padding-block: #{fluid((xs: 86, xl: 144))};
    }

    &--spacing-block-xl {
        --v-slice-padding-block: #{fluid((xs: 112, xl: 222))};
	}

    &--spacing-block-xxl {
		--v-slice-padding-block: #{fluid((xs: 194, xl: 322))};
    }
}
</style>
