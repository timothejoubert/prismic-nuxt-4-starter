<script lang="ts" setup>
import { getImageSizes } from '~/utils/media/image'
import type { ImageField, KeyTextField } from '@prismicio/client'
import type { VTextContent } from '~/components/VText.vue'

defineProps<{
    title: KeyTextField | string
    content?: VTextContent
    image?: ImageField
}>()

const IMAGE_SIZES = getImageSizes({ xs: '100vw', lg: '80vw' })
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
            :sizes="IMAGE_SIZES"
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
