<script setup lang="ts">
defineProps<{
    // Full `prefix:name` icon id, e.g. `icon:Play` for app/assets/images/icons/Play.svg
    name: string
    size?: number | string
}>()
</script>

<template>
    <NuxtIcon
        aria-hidden="true"
        :name="name"
        :size="size"
    />
</template>
