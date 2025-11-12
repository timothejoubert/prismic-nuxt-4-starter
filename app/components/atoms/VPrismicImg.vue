<script lang="ts">
import pick from 'lodash/pick'
import type { ImageField, LinkField } from '@prismicio/types'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field.ts'
import { vImgProps } from '~/components/atoms/VImg.vue'
import { VImg } from '#components'

export type VPrismicImageField = LinkField | ImageField

export const vPrismicImgProps = {
	field: {
		type: Object as PropType<VPrismicImageField>,
		required: true,
	},
	...vImgProps,
}

export default defineComponent({
	props: {
		...vPrismicImgProps,
	},
	setup(props) {
		const imgProps = computed(() => pick(props, Object.keys(vImgProps)))
		const imageField = computed(() => getImageFieldFilled(props.field))
		const mediaLinkField = computed(() => getFilledLinkToMedia(props.field))
		const src = computed(() => {
			const value = imageField.value?.url || mediaLinkField.value?.url || ''

			return value.substring(0, value.lastIndexOf('?'))
		})

		return () => h(VImg, {
			...imgProps.value,
			modifiers: {
				...props.modifiers,
				auto: props.modifiers?.auto || 'compress,format',
			},
			src: src.value,
			width: getInt(props.width || imageField.value?.dimensions.width || mediaLinkField.value?.width),
			height: getInt(props.height || imageField.value?.dimensions.height || mediaLinkField.value?.height),
			alt: typeof props.alt === 'string' ? props.alt : (imageField.value?.alt || mediaLinkField.value?.name),
			provider: 'imgix',
			placeholder: props.placeholder || '#eee',
			quality: 70,
		})
	},
})
</script>
