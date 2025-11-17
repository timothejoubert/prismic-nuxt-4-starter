import type { ImageField, LinkField } from '@prismicio/types'
import type { VImgProps } from '~/components/atoms/VImg.vue'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field.ts'

export type VPrismicImageField = LinkField | ImageField | undefined

export function usePrismicImage(
	field: MaybeRefOrGetter<VPrismicImageField>,
	imgProps?: Partial<VImgProps>,
) {
	const imageField = computed(() => getImageFieldFilled(toValue(field)))
	const mediaLinkField = computed(() => getFilledLinkToMedia(toValue(field)))
	const src = computed(() => {
		const value = imageField.value?.url || mediaLinkField.value?.url || ''

		return value.substring(0, value.lastIndexOf('?'))
	})

	return computed(() => {
		if (!src.value) return null

		return {
			provider: 'imgix',
			placeholder: '#eee',
			quality: 70,
			alt: imageField.value?.alt || mediaLinkField.value?.name,
			src: src.value,
			width: imageField.value?.dimensions.width || mediaLinkField.value?.width,
			height: imageField.value?.dimensions.height || mediaLinkField.value?.height,
			...imgProps,
			modifiers: {
				...imgProps?.modifiers,
				auto: imgProps?.modifiers?.auto || 'compress,format',
			},
		} as VImgProps
	})
}
