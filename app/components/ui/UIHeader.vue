<script lang="ts" setup>
import type { VPrismicImageField } from '../atoms/VPrismicImg.vue';
import type { VTextContent } from '~/components/atoms/VText.vue';

defineProps<{
    title: string
    content?: VTextContent
    image?: VPrismicImageField
}>()
</script>
<template>
    <header>
        <h1>{{ title }}</h1>
        <VText v-if="content" :content="content" />
        <VPrismicImg
            v-if="image?.url"
            width="1000"
            height="400"
            :field="image"
            :modifiers="{ fit: 'crop', ar: 1000 / 400 }"
        />
    </header>
</template>
<style lang="scss" module>
</style>
