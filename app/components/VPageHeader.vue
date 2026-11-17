<script lang="ts" setup>
import type { ImageField, KeyTextField } from '@prismicio/client'
import type { VTextContent } from '~/components/VText.vue'

defineProps<{
    title: KeyTextField | string
    content?: VTextContent
    image?: ImageField
}>()
</script>

<template>
    <header
        class="grid-container"
        :class="$style.root"
    >
        <h1 v-if="title">
            {{ title }}
        </h1>
        <VText
            v-if="content"
            :content="content"
        />
        <!-- Above the fold: loaded eagerly with a high priority (LCP candidate) -->
        <VPrismicImage
            v-if="image"
            :field="image"
            width="1000"
            height="400"
            sizes="xs:100vw sm:100vw md:100vw lg:80vw vl:80vw xl:80vw xxl:80vw hd:80vw"
            loading="eager"
            fetchpriority="high"
        />
    </header>
</template>

<style lang="scss" module>
.root {
    margin-block: 42px;
}
</style>
