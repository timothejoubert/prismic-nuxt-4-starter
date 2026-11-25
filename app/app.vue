<script lang="ts" setup>
</script>

<template>
    <NuxtRouteAnnouncer />
    <VSkipLink />
    <header role="banner">
        <VNav />
    </header>
    <NuxtPage />
    <VFooter />
    <DevOnly>
        <VGridVisualizer />
    </DevOnly>
</template>
