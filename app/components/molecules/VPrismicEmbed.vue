<script lang="ts" setup>
import type { EmbedField } from '@prismicio/types'
import { VVideoPlayer } from '#components'
import type { VImgProps } from '~/components/atoms/VImg.vue'

export type VVideoPlayerProps = InstanceType<typeof VVideoPlayer>["$props"];

const props = defineProps<{
	field: EmbedField
	mediaProps?: Partial<VVideoPlayerProps>
	thumbnail?: VPrismicImageField
	thumbnailProps?: Partial<VImgProps>
}>()

const { filledField: filledEmbed, componentProps: embedProps } = usePrismicEmbed(props.field, props.mediaProps)
const { filledField: filledImage, componentProps: imageProps } = usePrismicImage(props.thumbnail, props.thumbnailProps)

const userHasClicked = ref(false)
function onWrapperClick() {
	userHasClicked.value = true
}
</script>
<template>
	<div
		:class="[
			$style['wrapper'],
			userHasClicked && $style['wrapper--clicked'],
		]"
		@click="onWrapperClick"
		v-if="filledEmbed && filledImage"
	>
		<button :class="$style['play']" :aria-label="$t('play_video')">
			<VIcon
				name="Play"
			/>
		</button>
		<VImg v-bind="imageProps" :class="$style['img']" />
		<VVideoPlayer
			v-if="userHasClicked"
			ref="inner-embed-video"
			v-bind="embedProps"
			:class="$style['video']"
			:autoplay="userHasClicked || embedProps?.autoplay"
		/>
	</div>
	<VVideoPlayer
		v-else-if="filledEmbed"
		ref="inner-embed-video"
		v-bind="embedProps"
		:class="$style['video']"
		:autoplay="userHasClicked || embedProps?.autoplay"
	/>
</template>

<style lang="scss" module>
.wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.play {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 6px;
	font-size: 20px;

	.wrapper--clicked & {
		display: none;
	}
}

.video {
	.wrapper & {
		--v-player-video-position: absolute;
		--v-player-video-height: 100%;

		inset: 0;
	}
}

.img {
	.wrapper--clicked & {
		opacity: 0;
		pointer-events: none;
	}
}
</style>
