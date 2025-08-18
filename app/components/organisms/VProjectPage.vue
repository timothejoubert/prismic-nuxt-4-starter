<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: ProjectDocument
}>()
</script>
<template>
    <div>
        <header>
            <h1>{{ document.data.title }}</h1>
        </header>
    </div>
</template>
<style lang="scss" module>
</style>
