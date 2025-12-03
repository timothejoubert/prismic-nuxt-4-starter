<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'
import { VPrismicLink } from '#components'

const props = defineProps<{
	project: ProjectPageDocument
}>()


const title = computed(() => props.project.data.title)
const content = computed(() => props.project.data.content)
const image = computed(() => props.project.data.image)
const tags = computed(() => props.project.tags || [])
const url = computed(() => props.project.url)

const $style = useCssModule()
const rootClasses = computed(() => {
	return [
		url.value && $style['root--has-link'],
		$style.root,
	]
})
</script>

<template>
	<div
		:class="rootClasses"
	>
		<component
			:is="url ? VPrismicLink : 'h3'"
			v-if="title"
			:to="url"
			:class="[$style.title]"
		>
			{{ title }}
		</component>
		<template v-if="tags && tags.length">
			<TransitionGroup
				:name="$style['tag-animation']"
				tag="div"
				:class="$style.tags"
			>
				<button
					v-for="(tag, i) in tags"
					:key="tag"
					theme="accent"
					tag="div"
					:filled="true"
					:style="{ '--tag-index': tags.length - i }"
					size="xs"
					:class="$style.tag"
				>
					{{ tag }}
				</button>
			</TransitionGroup>
		</template>
		<VText
			v-if="content"
			:class="$style.content"
			:content="content"
		/>
		<VPrismicImage
			:field="image"
			:media-props="{
				sizes: 'xs:92vw sm:92vw md:30vw lg:22vw xl:22vw hq:22vw qhd:22vw',
				width: 400,
				height: 400,
				modifiers: {
					fit: 'crop',
				},
			}"
			:class="$style.image"
		/>
	</div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    flex-direction: column;
}

.title {
    order: 2;
    margin-block: 10px;

    @at-root .root a#{&}::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    order: 3;
    gap: 6px;
}

.content {
    order: 4;
    margin-top: 10px;
}

.image {
    order: 1;
}
</style>
