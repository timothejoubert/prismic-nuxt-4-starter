<script lang="ts" setup>
import type { HomePageDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: HomePageDocument
}>()

const page = computed(() => props.document.data)
</script>
<template>
    <div>
        <UIHeader
            :title="page.title"
            :content="page.content"
            :image="page.media?.[0]?.image"
        />
    </div>
</template>

<!-- <style lang="scss" module></style> -->
