<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
	getSliceComponentProps<Content.AllFieldsTestSlice>(),
)

function getFilledGroupField(group: typeof mediaGroup.value[0]) {
	if (!group) return

	const { filledEmbed } = usePrismicMediaField({videoField: group.embed })
	const { filledImage } = usePrismicMediaField({imgField: group.image })
	const { filledImage: filledResponsiveImage } = usePrismicMediaField({imgField: group.responsive_image })
	const { filledImage: filledMedia } = usePrismicMediaField({imgField: group.media })
	const { filledImage: filledLink } = usePrismicMediaField({imgField: group.link })
	const { filledImage: filledLinkRepeatable } = usePrismicMediaField({imgField: group.link_repeatable?.[0] })

	return filledEmbed.value || filledImage.value || filledResponsiveImage.value || filledMedia.value || filledLink.value || filledLinkRepeatable.value
}

const mediaGroup = computed(() => props.slice.primary.media_group)
const medias = computed(() => {
	return mediaGroup.value?.filter((group) => {
		return !!getFilledGroupField(group)
	}).map((group) => {
		return getFilledGroupField(group)
	})
})

</script>

<template>
	<VSlice
		:slice="slice"
		:class="$style.root"
	>
		<div
			v-for="(medias, i) in medias"
			:key="`media-${i}`"
			:class="$style.media"
		>
			<VPrismicMedia
				:img-field="medias"
				:video-field="medias"
				:img-props="{ sizes: 'sm:100vw hd:50vw'}"
			/>
		</div>
	</VSlice>
</template>

<style lang="scss" module>
.root {
	position: relative;;
}
</style>
