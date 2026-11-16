<script lang="ts" setup>
// Same hashed asset as the @font-face src in assets/scss/_fonts.scss, so the preload is reused instead of fetched twice.
import mainFontUrl from '~/assets/fonts/tt-norms-pro-regular-subset.woff2?url'

useHead({
    link: [{ rel: 'preload', as: 'font', type: 'font/woff2', href: mainFontUrl, crossorigin: '' }],
})
</script>

<template>
    <NuxtRouteAnnouncer />

    <VSkipLink />

    <VNav />

    <NuxtPage />

    <DevOnly>
        <VGridVisualizer />
    </DevOnly>
</template>
