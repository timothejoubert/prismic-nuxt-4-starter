<script setup lang="ts">
import { type Content, isFilled } from '@prismicio/client'

// Test slice: renders every media field the starter supports in each rendering of the media components
// (media-components.md), to check them in a page or the slice simulator. A case only shows when its field is
// filled. Labels are dev-only, not UI copy.
const props = defineProps(getSliceComponentProps<Content.AllFieldsTestSlice>())

const mediaGroup = computed(() => props.slice.primary.media_group)

const RESPONSIVE_SOURCES = [
    { view: 'small', media: '(width < 768px)' },
    { view: 'medium', media: '(width < 1024px)' },
]
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
    >
        <div
            v-for="(group, i) in mediaGroup"
            :key="`media-${i}`"
            :class="$style.group"
        >
            <section
                v-if="isFilled.image(group.image)"
                :class="$style.case"
            >
                <h3>image: &lt;img&gt;, field ratio</h3>
                <VPrismicImage
                    :field="group.image"
                    sizes="xs:100vw md:33vw"
                />
            </section>
            <section
                v-if="isFilled.image(group.image)"
                :class="$style.case"
            >
                <h3>image: width 1600 + height 900 (16 / 9 crop)</h3>
                <VPrismicImage
                    :field="group.image"
                    width="1600"
                    height="900"
                    sizes="xs:100vw md:33vw"
                />
            </section>
            <section
                v-if="isFilled.image(group.image)"
                :class="$style.case"
            >
                <h3>image: square, modifiers crop faces + grayscale</h3>
                <VPrismicImage
                    :field="group.image"
                    width="800"
                    height="800"
                    :modifiers="{ crop: ['faces', 'entropy'], sat: -100 }"
                    sizes="xs:100vw md:33vw"
                />
            </section>
            <section
                v-if="isFilled.image(group.image)"
                :class="$style.case"
            >
                <h3>image: &lt;figure&gt; (#caption slot + field copyright)</h3>
                <VPrismicImage
                    :field="group.image"
                    sizes="xs:100vw md:33vw"
                >
                    <template #caption>
                        Caption from the #caption slot
                    </template>
                </VPrismicImage>
            </section>
            <section
                v-if="isFilled.image(group.responsive_image)"
                :class="$style.case"
            >
                <h3>responsive_image: &lt;picture&gt; from the views (resize the window)</h3>
                <VPrismicImage
                    :field="group.responsive_image"
                    :sources="RESPONSIVE_SOURCES"
                    sizes="xs:100vw md:33vw"
                />
            </section>
            <section
                v-if="isFilled.image(group.responsive_image)"
                :class="$style.case"
            >
                <h3>responsive_image: #sources slot (image field below 768px)</h3>
                <VPrismicImage
                    :field="group.responsive_image"
                    sizes="xs:100vw md:33vw"
                >
                    <template #sources="{ getSource }">
                        <source
                            media="(width < 768px)"
                            v-bind="getSource(group.image, { width: 600, height: 600 })"
                        >
                    </template>
                </VPrismicImage>
            </section>
            <section
                v-if="isFilled.embed(group.embed)"
                :class="$style.case"
            >
                <h3>embed: thumbnail from the image field, Video.js on click</h3>
                <VPrismicVideo
                    :field="group.embed"
                    :poster="group.image"
                    sizes="xs:100vw md:33vw"
                />
            </section>
            <section
                v-if="isFilled.embed(group.embed)"
                :class="$style.case"
            >
                <h3>embed: provider thumbnail, Video.js on click</h3>
                <VPrismicVideo :field="group.embed" />
            </section>
            <section
                v-if="isFilled.embed(group.embed)"
                :class="$style.case"
            >
                <h3>embed: background (YouTube / Vimeo only)</h3>
                <VPrismicVideo
                    :field="group.embed"
                    :poster="group.image"
                    background
                />
            </section>
            <section
                v-if="isFilled.linkToMedia(group.media)"
                :class="$style.case"
            >
                <h3>media (link to media): VPrismicMedia</h3>
                <VPrismicMedia
                    :field="group.media"
                    :image-props="{ sizes: 'xs:100vw md:33vw' }"
                />
            </section>
            <section
                v-if="isFilled.linkToMedia(group.media)"
                :class="$style.case"
            >
                <h3>media (link to media): video file in background</h3>
                <VPrismicMedia
                    :field="group.media"
                    :video-props="{ background: true, poster: group.image }"
                />
            </section>
            <section
                v-if="isFilled.link(group.link)"
                :class="$style.case"
            >
                <h3>link (any link): VPrismicMedia, renders only a media</h3>
                <VPrismicMedia :field="group.link" />
            </section>
            <section
                v-for="(link, linkIndex) in group.link_repeatable"
                :key="`repeatable-${linkIndex}`"
                :class="$style.case"
            >
                <h3>link_repeatable[{{ linkIndex }}]: VPrismicMedia</h3>
                <VPrismicMedia :field="link" />
            </section>
        </div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    display: grid;
    gap: 48px;
}

.group {
    display: grid;
    gap: 32px 24px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.case {
    display: grid;
    align-content: start;
    gap: 8px;

    h3 {
        font-family: monospace;
        font-size: 12px;
        font-weight: normal;
    }
}
</style>
