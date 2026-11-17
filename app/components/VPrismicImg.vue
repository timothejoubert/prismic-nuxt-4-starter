<script lang="ts" setup>
import { getPrismicImage } from '~/utils/prismic/media'

const props = defineProps<{
    // Image field or link to (image) media field
    field: unknown
    // Overrides the alt text written in Prismic; `""` for a decorative image
    alt?: string
    // Extra imgix params (`crop: 'faces'`, `q`...), merged over the ones Prismic puts in the URL.
    // Size and ratio go through the `width`, `height` and `fit` attributes: @nuxt/image lets them override modifiers.
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

// Defaults from the field; any <NuxtImg> attribute (width, height, fit...) passed by the parent wins.
// `width` + `height` set the ratio, like on VVideo and VEmbed: `cover` (imgix `fit=crop`) crops to it,
// and is a no-op with the field's own dimensions.
const imgProps = computed(() => image.value && {
    src: image.value.src,
    width: image.value.width,
    height: image.value.height,
    fit: 'cover',
    alt: typeof props.alt === 'string' ? props.alt : image.value.alt,
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
