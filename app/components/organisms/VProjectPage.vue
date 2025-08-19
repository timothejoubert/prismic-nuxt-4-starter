<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types';
import VPrismicImg from '../atoms/VPrismicImg.vue';
import VVideoPlayer from '../atoms/VVideoPlayer.vue';
import { prismicDocumentRoute } from '~~/shared/prismic-routes'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const project = computed(() => props.document.data)

const tags = computed(() => {
    return props.document.tags || []
})

</script>
<template>
    <div :class="$style.root">
        <header>
            <h1>Project page | {{ document.data.title }}</h1>
            <VPrismicLink :to="prismicDocumentRoute.project_listing_page">Retour</VPrismicLink>
            <template v-if="tags.length">
                <button v-for="(tag, i) in tags" :key="tag || i">{{ tag }}</button>
            </template>
            <VTime :date="project.creation_date" format="full" />
            <VText v-if="project.content" :content="project.content" />
            <VText v-if="project.credits" :content="project.credits" />
            <VPrismicImg
                :field="project.image"
            />
        </header>

        <main>
            <div :class="$style.medias" v-if="medias?.length">
                <div v-for="(mediaGroup, i) in medias" :key="`media-${i}`" :class="$style.media">
                    <VVideoPlayer
                        v-if="mediaGroup.type === 'video'"
                        autoplay
                        muted
                        :controls="false"
                        loop
                        :src="mediaGroup.media.url"
                    />
                    <VPrismicImg
                        v-else
                        :field="mediaGroup.media"
                    />
                </div>
            </div>
        </main>

    </div>
</template>
<style lang="scss" module>
.root {
    position: relative;
}
</style>
