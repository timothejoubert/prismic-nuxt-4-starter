<script lang="ts" setup>
import { getPrismicImage } from '~/utils/prismic/media'

const props = defineProps<{
    // Image field or link to (image) media field
    field: unknown
    // Overrides the alt text written in Prismic; `""` for a decorative image
    alt?: string
    // Merged over the imgix params Prismic puts in the URL (format, crop...)
    modifiers?: Record<string, string | number>
    // Art direction from the image field's responsive views, first matching media query wins
    views?: { name: string, media: string }[]
}>()

defineOptions({
    // Attributes (class, sizes, width, loading...) go to the <img>, whether it sits in a <picture> or not
    inheritAttrs: false,
})

const image = computed(() => getPrismicImage(props.field))
const $img = useImage()

const imgProps = computed(() => image.value && {
    src: image.value.src,
    width: image.value.width,
    height: image.value.height,
    alt: props.alt ?? image.value.alt,
    provider: 'imgix',
    modifiers: { ...image.value.modifiers, ...props.modifiers },
})

const sources = computed(() => (props.views || []).flatMap(({ name, media }) => {
    const view = getPrismicImage(props.field, name)
    if (!view) return []

    return [{
        media,
        width: view.width,
        height: view.height,
        srcset: $img(view.src, { ...view.modifiers, ...props.modifiers }, { provider: 'imgix' }),
    }]
}))
</script>

<template>
    <picture
        v-if="imgProps && sources.length"
        :class="$style.picture"
    >
        <source
            v-for="source in sources"
            :key="source.media"
            :media="source.media"
            :srcset="source.srcset"
            :width="source.width"
            :height="source.height"
        >
        <VImg v-bind="{ ...imgProps, ...$attrs }" />
    </picture>
    <VImg
        v-else-if="imgProps"
        v-bind="{ ...imgProps, ...$attrs }"
    />
</template>

<style lang="scss" module>
.picture {
    // The <img> keeps the layout and the classes, <picture> only picks its source
    display: contents;
}
</style>
