<script lang="ts" setup>
import type { EmbedField } from '@prismicio/types'
import type { VImgProps } from '~/components/atoms/VImg.vue'
import { VVideoPlayer } from '#components'

type VVideoPlayerProps = InstanceType<typeof VVideoPlayer>["$props"];

const props = defineProps<{
	imgField?: VPrismicImageField
	imgProps?: Partial<VImgProps>
	videoField?: EmbedField
	videoProps?: Partial<VVideoPlayerProps>
}>()

const prismic = usePrismic()
const videoProps = computed(() => {
	if(!props.videoField) return

	if (prismic.isFilled.embed(props.videoField)) {
		return {
			embedPlatform: props.videoField?.provider_name?.toLowerCase(),
			embedId: props.videoField?.embed_url ? props.videoField.embed_url.split('/').pop() : undefined,
			...(props.videoProps || {}),
		}
	}

	 return undefined
})

const imgProps = computed(() => {
	if(!props.imgField) return

	return usePrismicImage(props.imgField, props.imgProps)?.value
})

const hasVideoAndImg = computed(() => !!videoProps.value && !!imgProps.value)

const userHasClicked = ref(false)
function onWrapperClick() {
	userHasClicked.value = true
}
</script>
<template>
	<div
		v-if="hasVideoAndImg"
		:class="[
			$style['wrapper'],
			userHasClicked && $style['wrapper--clicked'],
		]"
		@click="onWrapperClick"
	>
		<button :class="$style['wrapper__play']" :aria-label="$t('play_video')">
			<VIcon
				name="Play"
			/>
		</button>
		<VImg v-bind="imgProps" :class="$style['wrapper__img']" />
		<VVideoPlayer
			v-if="userHasClicked"
			ref="inner-embed-video"
			v-bind="videoProps"
			:class="$style['wrapper__video']"
			:autoplay="userHasClicked || videoProps?.autoplay"
		/>
	</div>
	<VVideoPlayer v-else-if="videoProps" v-bind="videoProps" />
	<VImg v-else-if="imgProps" v-bind="imgProps"  />
</template>
<style lang="scss" module>
.wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.wrapper__play {
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

.wrapper__video {
	--v-player-video-position: absolute;
	--v-player-video-height: 100%;

	inset: 0;
}

.wrapper__img {
	.wrapper--clicked & {
		opacity: 0;
		pointer-events: none;
	}
}
</style>
