<script lang="ts" setup>
import type { UsePrismicMediaFieldOptions } from '~/composables/use-prismic-media-field'

const props = defineProps<UsePrismicMediaFieldOptions>()

const { filledImage, imageProps, filledEmbed, embedProps } = usePrismicMediaField({
	imgField: props.imgField,
	imgProps: props.imgProps,
	videoField: props.videoField,
	videoProps: props.videoProps,
})

const hasVideoAndImg = computed(() => !!filledImage.value && !!filledEmbed.value)

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
		<VImg v-bind="imageProps" :class="$style['wrapper__img']" />
		<VVideoPlayer
			v-if="userHasClicked"
			ref="inner-embed-video"
			v-bind="embedProps"
			:class="$style['wrapper__video']"
			:autoplay="userHasClicked || embedProps?.autoplay"
		/>
	</div>
	<VVideoPlayer v-else-if="embedProps" v-bind="embedProps" />
	<VImg v-else-if="imageProps" v-bind="imageProps"  />
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
