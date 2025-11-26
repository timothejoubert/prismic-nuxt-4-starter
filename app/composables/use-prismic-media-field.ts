import type { EmbedField } from '@prismicio/types'
import type { VImgProps } from '~/components/atoms/VImg.vue'
import { VVideoPlayer } from '#components'

export type VVideoPlayerProps = InstanceType<typeof VVideoPlayer>["$props"];

export type UsePrismicMediaFieldOptions = {
	imgField?: VPrismicImageField
	imgProps?: Partial<VImgProps>
	videoField?: EmbedField
	videoProps?: Partial<VVideoPlayerProps>
}

export function usePrismicMediaField(options: UsePrismicMediaFieldOptions) {

	const { filledField: filledEmbed, componentProps: embedProps } = usePrismicEmbed(options.videoField, options.videoProps)
	const { filledField: filledImage, componentProps: imageProps } = usePrismicImage(options.imgField, options.imgProps)

	return {
		filledEmbed,
		embedProps,
		filledImage,
		imageProps,
	}
}
