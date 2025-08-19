<script lang="ts" setup>
import type { ArchiveDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: ArchiveDocument
}>()
</script>
<template>
    <div>
        <header>
            <h1>Archive page | {{ document.data.title }}</h1>
        </header>
    </div>
</template>
<style lang="scss" module>
</style>
