<script lang="ts" setup>
import { SKIP_LINKS } from '~/constants/skip-links'
</script>

<template>
    <main :id="SKIP_LINKS.main.elementId">
        <slot />
    </main>
</template>
