<script lang="ts">
import type { ImageOptions } from '@nuxt/image'

export const vImgProps = {
	...imageProps,
	// @nuxt/image options
	preset: {
		type: String,
		required: false,
	},
	placeholder: {
		type: [Boolean, String, Number, Array] as PropType<boolean | string | number | [number, number?, number?, number?]>,
		required: false,
	},
	modifiers: {
		type: Object as PropType<ImageOptions['modifiers'] & { auto?: string, ar?: string }>,
		required: false,
	},
}

export type VImgProps = ExtractPropTypes<typeof vImgProps>

export default defineComponent({
	props: {
		...vImgProps,
	},
	emits: ['load', 'error'],
	setup(props, context) {
		// STYLE
		const $style = useCssModule()
		const style = computed(() => {
			// TODO: return background-image when placeholder is an image file
			const isString = typeof props.placeholder === 'string'
			const isImg = isString && props.placeholder?.includes('.')
			const placeholderColor = isString && !isImg && props.placeholder

			return {
				'--v-img-placeholder': placeholderColor,
			}
		})

		// NODE EVENT
		const root = ref<HTMLImageElement | null>(null)
		const loaded = ref(false)
		const onLoad = (event?: Event) => {
			loaded.value = true
			if (event) context.emit('load', event)
		}
		const onError = () => {
			context.emit('error')
		}

		onMounted(() => {
			if (!root.value) return

			if (root.value?.complete) onLoad()
		})

		// DATA
		const $img = useImage()
		const width = computed(() => parseSize(props.width))
		const height = computed(() => parseSize(props.height))
		const modifiers = computed<ImageOptions['modifiers']>(() => ({
			...props.modifiers,
			width: width.value,
			height: height.value,
			quality: getInt(props.quality || props.modifiers?.quality) || $img.options.quality,
			format: props.format || props.modifiers?.format,
		}))

		const options = computed(() => ({
			provider: props.provider,
			preset: props.preset,
			densities: props.densities,
			modifiers: modifiers.value,
		} as ImageOptions))

		const src = computed(() => $img(props.src!, modifiers.value, options.value))

		const responsiveImageData = computed(() => {
			return (
				(props.sizes || props.densities)
				&& $img.getSizes(props.src!, {
					...options.value,
					sizes: props.sizes,
				})
			)
		})
		const internalSizes = computed(() => {
			const result = responsiveImageData.value && responsiveImageData.value.sizes

			if (result === '100vw') return // do not output sizes="100vw" as it is the default value

			return result
		})

		// @see https://github.com/nuxt/image/blob/main/src/runtime/components/nuxt-img.ts
		if (props.preload) {
			const isResponsive = responsiveImageData.value && Object.values(responsiveImageData.value).every(v => v)

			useHead({
				link: [
					{
						rel: 'preload',
						as: 'image',
						nonce: props.nonce,
						...(!isResponsive
							? { href: src.value }
							: {
									href: responsiveImageData.value.src,
									imagesizes: responsiveImageData.value.sizes,
									imagesrcset: responsiveImageData.value.srcset,
								}),
						...(typeof props.preload !== 'boolean' && props.preload.fetchPriority
							? { fetchpriority: props.preload.fetchPriority }
							: {}),
					},
				],
			})
		}

		return () =>
			h('img', {
				src: src.value,
				srcset: responsiveImageData.value?.srcset,
				sizes: internalSizes.value,
				ref: root,
				width: width.value,
				height: height.value,
				alt: props.alt || '',
				loading: props.loading,
				crossorigin: props.crossorigin,
				decoding: props.decoding,
				longdesc: props.longdesc,
				style: style.value,
				class: [$style.root, loaded.value && $style['root--loaded']],
				onLoad,
				onError,
			})
	},
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-img-display, block);
    width: var(--v-img-width, 100%);
    max-width: var(--v-img-max-width, 100%); // responsive image
    height: var(--v-img-height, auto); // responsive image
    background: var(--v-img-background, var(--v-img-placeholder));

    &--loaded {
        // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
        --v-img-background: none;
    }
}
</style>
