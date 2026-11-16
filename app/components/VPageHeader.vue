<script lang="ts" setup>
import type { KeyTextField } from '@prismicio/client'
import type { VTextContent } from '~/components/VText.vue'
import type { VPrismicImageField } from '~/components/VPrismicImg.vue'

defineProps<{
    title: KeyTextField | string
    content?: VTextContent
    image?: VPrismicImageField
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
        <VPrismicImg
            v-if="image"
            :field="image"
            :width="1000"
            :height="600"
            :modifiers="{ fit: 'crop' }"
            sizes="xs:100vw md:100vw lg:80vw"
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
