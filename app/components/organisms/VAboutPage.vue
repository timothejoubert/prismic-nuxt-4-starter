<script lang="ts" setup>
import type { AboutDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: AboutDocument
}>()
</script>
<template>
    <div>
        <header>
            <h1>About page | {{ document.data.title }}</h1>
        </header>
    </div>
</template>
<style lang="scss" module>
</style>
