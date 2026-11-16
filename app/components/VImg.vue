<script lang="ts" setup>
/**
 * Image rendered by @nuxt/image: every other attribute (src, sizes, width, height, modifiers,
 * provider, fetchpriority...) passes through to <NuxtImg>.
 */
withDefaults(defineProps<{
    // Required on purpose: an empty string marks a decorative image
    alt: string
    loading?: 'lazy' | 'eager'
    // Background shown while the image loads (also settable through `--v-img-placeholder`)
    placeholderColor?: string
}>(), {
    loading: 'lazy',
})
</script>

<template>
    <NuxtImg
        :alt="alt"
        :loading="loading"
        :class="$style.root"
        :style="placeholderColor ? { '--v-img-placeholder': placeholderColor } : undefined"
    />
</template>

<style lang="scss" module>
.root {
    display: var(--v-img-display, block);
    width: var(--v-img-width, 100%);
    max-width: 100%;
    height: var(--v-img-height, auto);
    background-color: var(--v-img-placeholder, transparent);
    object-fit: var(--v-img-object-fit, initial);
}
</style>
