<script lang="ts" setup>
import type { Component } from 'vue'
import { NuxtImg } from '#components'
import { getHeightForWidth } from '~/utils/media/aspect-ratio'
import { pickImageOptions } from '~/utils/media/image'
import { getPrismicImage } from '~/utils/prismic/media'
import type { PrismicImageOptions, VPrismicImageProps } from '~/types/media'

/**
 * Image field (or link to an image) rendered through @nuxt/image and imgix:
 * - `<picture>` when `sources` or a `#sources` slot is given (art direction),
 * - `<figure>` when the image has a copyright or a `#caption` slot is given,
 * - `<img>` otherwise. Renders nothing when the field is empty.
 * Every other NuxtImg prop or attribute (placeholder, fetchpriority...) goes to the `<img>`;
 * `class` and `style` go to the outer element.
 */
const props = withDefaults(defineProps<VPrismicImageProps>(), {
    loading: 'lazy',
    fit: 'cover',
})

const slots = defineSlots<{
    sources?: (props: { getSource: typeof getSource }) => unknown
    caption?: () => unknown
}>()

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const $img = useImage()

const image = computed(() => getPrismicImage(props.field))

function getInheritedOptions(options: PrismicImageOptions): PrismicImageOptions {
    return {
        ...pickImageOptions(props),
        ...options,
        modifiers: { ...props.modifiers, ...options.modifiers },
    }
}

/**
 * `<source>` attributes (srcset, sizes, width, height) for an image field or one of its views,
 * built like the `<img>` (imgix params kept, crop to width + height). Exposed to the `#sources` slot.
 */
function getSource(field: unknown, options: PrismicImageOptions & { view?: string } = {}) {
    const source = getPrismicImage(field, options.view)
    if (!source) return undefined

    const { width: optionWidth, height: optionHeight, view: _view, ...rest } = options
    const merged = getInheritedOptions(rest)
    const width = Number(optionWidth) || source.width
    // A width alone keeps the source's ratio
    const height = Number(optionHeight)
      || (optionWidth && width ? getHeightForWidth(width, source.width, source.height) : source.height)

    const { srcset, sizes } = $img.getSizes(source.src, {
        sizes: merged.sizes,
        densities: merged.densities,
        preset: merged.preset,
        provider: 'imgix',
        modifiers: {
            ...source.modifiers,
            ...merged.modifiers,
            width,
            height,
            fit: merged.fit,
            format: merged.format,
            quality: merged.quality,
        },
    })

    return { srcset, sizes, width, height }
}

const sourceList = computed(() => (props.sources || []).flatMap(({ media, field, ...options }) => {
    const source = getSource(field ?? props.field, options)

    return source ? [{ media, ...source }] : []
}))

const copyrightText = computed(() => props.copyright ?? image.value?.copyright)
const isPicture = computed(() => !!sourceList.value.length || !!slots.sources)
const isFigure = computed(() => !!copyrightText.value || !!slots.caption)

// Only the keys the parent set: an undefined `style` would still render `style=""`
const rootAttrs = computed(() => Object.fromEntries(Object.entries({ class: attrs.class, style: attrs.style })
    .filter(([, value]) => value !== undefined)))

const imgProps = computed(() => {
    if (!image.value) return undefined

    const { class: _class, style: _style, ...imgAttrs } = attrs

    return {
        src: image.value.src,
        alt: props.alt ?? image.value.alt,
        width: props.width ?? image.value.width,
        height: props.height ?? image.value.height,
        loading: props.loading,
        ...pickImageOptions(props),
        provider: 'imgix' as const,
        modifiers: { ...image.value.modifiers, ...props.modifiers },
        ...imgAttrs,
        // The outermost element takes class and style
        ...(isPicture.value || isFigure.value ? {} : rootAttrs.value),
    }
})

const style = useCssModule()

// Shared by the three layouts below (img, picture, figure)
// NuxtImg is a generic component, which h() can't type: cast it
const Img = () => {
    const { class: className, ...rest } = imgProps.value as Record<string, unknown>

    return h(NuxtImg as Component, { ...rest, class: [style.image, className] })
}
const PictureSources = () => [
    ...sourceList.value.map(source => h('source', { key: source.media, ...source })),
    slots.sources?.({ getSource }),
]
</script>

<template>
    <figure
        v-if="imgProps && isFigure"
        v-bind="rootAttrs"
    >
        <picture v-if="isPicture">
            <PictureSources />
            <Img />
        </picture>
        <Img v-else />
        <figcaption :class="$style.caption">
            <slot name="caption" />
            <small v-if="copyrightText">{{ $t('media.copyright', { copyright: copyrightText }) }}</small>
        </figcaption>
    </figure>
    <picture
        v-else-if="imgProps && isPicture"
        v-bind="rootAttrs"
    >
        <PictureSources />
        <Img />
    </picture>
    <Img v-else-if="imgProps" />
</template>

<style lang="scss" module>
.image {
    display: var(--v-prismic-image-display, block);
    width: var(--v-prismic-image-width, 100%);
    max-width: 100%;
    height: var(--v-prismic-image-height, auto);
    background-color: var(--v-prismic-image-placeholder, transparent);
    object-fit: var(--v-prismic-image-object-fit, initial);
}

.caption {
    display: flex;
    flex-direction: column;
    margin-top: var(--v-prismic-image-caption-gap, 8px);
    gap: 4px;
}
</style>
