import type { ImageField, LinkField } from '@prismicio/types'
import type { VImgProps } from '~/components/atoms/VImg.vue'
import { isImageField } from '~/utils/prismic/image-field'
import { isLinkToMediaFieldFilled } from '~/utils/prismic/link-field.ts'

export type VPrismicImageField = LinkField | ImageField | undefined | null

export function usePrismicImage(
	field: MaybeRefOrGetter<VPrismicImageField>,
	imgProps?: Partial<VImgProps>,
) {
	const prismic = usePrismic()

	const imageField = computed(() => {
		const imgField = toValue(field) && isImageField(toValue(field))
		return prismic.isFilled.image(imgField) ? imgField : undefined
	})

	const mediaLinkField = computed(() => {
		const linkToMediaField = toValue(field) && isLinkToMediaFieldFilled(toValue(field))
		return prismic.isFilled.linkToMedia(linkToMediaField) ? linkToMediaField : undefined
	})

	const filledField = computed(() => {
		return imageField.value || mediaLinkField.value
	})

	const src = computed(() => {
		const value = filledField.value?.url || ''

		return value.substring(0, value.lastIndexOf('?'))
	})

	const componentProps = computed(() => {
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

	return {
		filledField,
		componentProps
	}
}
