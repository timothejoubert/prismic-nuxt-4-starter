<script lang="ts" setup>
import type { ImageFieldImage } from '@prismicio/client'
import { getPrismicEmbed, getPrismicImage, getPrismicVideo, type PrismicMediaField } from '~/utils/prismic/media'

/**
 * Renders whatever media a Prismic field holds: YouTube/Vimeo embed, video file (link to media)
 * or image (image field or link to an image). Renders nothing when the field is empty.
 */
const props = defineProps<{
    field: PrismicMediaField
    // Poster of an embed (the iframe then loads on demand) or of a video,
    // shown on its own when `field` holds no media
    poster?: ImageFieldImage | null
    alt?: string
    sizes?: string
    // Decorative looped video, see VVideo
    background?: boolean
}>()

const embed = computed(() => getPrismicEmbed(props.field))
const video = computed(() => !embed.value && getPrismicVideo(props.field))
const posterImage = computed(() => getPrismicImage(props.poster))
const imageField = computed(() => getPrismicImage(props.field) ? props.field : props.poster)

const $img = useImage()
const posterUrl = computed(() => posterImage.value && $img(posterImage.value.src, { ...posterImage.value.modifiers, width: 1280 }, { provider: 'imgix' }))
</script>

<template>
    <VEmbed
        v-if="embed"
        :source="embed.source"
        :title="embed.title || $t('media.embed_title')"
        :width="embed.width"
        :height="embed.height"
    >
        <template
            v-if="posterImage"
            #poster
        >
            <VPrismicImg
                :field="poster"
                :sizes="sizes"
                alt=""
            />
        </template>
    </VEmbed>
    <VVideo
        v-else-if="video"
        :sources="[video]"
        :poster="posterUrl"
        :label="alt"
        :background="background"
    />
    <VPrismicImg
        v-else
        :field="imageField"
        :alt="alt"
        :sizes="sizes"
    />
</template>
