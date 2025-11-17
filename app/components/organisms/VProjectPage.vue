<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'
import { PROJECT_LISTING_TYPE } from '~~/shared/prismic-documents';
import { getPrismicRoute } from '~~/shared/prismic-routes'

const props = defineProps<{
	document: ProjectPageDocument
}>()

const project = computed(() => props.document.data)

const tags = computed(() => {
	return props.document.tags || []
})

const imgProps = usePrismicImage(project.value.image)
const projectListingRoute = getPrismicRoute(PROJECT_LISTING_TYPE)
</script>

<template>
	<div :class="$style.root">
		<header>
			<h1>Project page | {{ document.data.title }}</h1>
			<VPrismicLink :to="projectListingRoute">
				Retour
			</VPrismicLink>
			<template v-if="tags.length">
				<button
					v-for="(tag, i) in tags"
					:key="tag || i"
				>
					{{ tag }}
				</button>
			</template>
			<VTime
				:date="project.creation_date"
				format="full"
			/>
			<VText
				v-if="project.content"
				:content="project.content"
			/>
			<VText
				v-if="project.credits"
				:content="project.credits"
			/>
			<VImg
				v-if="imgProps"
				v-bind="imgProps"
			/>
		</header>
	</div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
