import type { EmbedField } from '@prismicio/types'

type UsePrismicEmbedField = MaybeRefOrGetter<EmbedField | null | undefined>

export function usePrismicEmbed(field: UsePrismicEmbedField, props?: Partial<VVideoPlayerProps>) {
	const prismic = usePrismic()

	const filledEmbed = computed(() => {
		return prismic.isFilled.embed(toValue(field)) ? toValue(field) : undefined
	})

	const componentProps = computed(() => {
		if(!filledEmbed.value) return

		return {
			// ...filledEmbed.value,
			...(props || {}),
			embedPlatform: filledEmbed.value?.provider_name?.toLowerCase(),
			embedId: filledEmbed.value?.embed_url ? filledEmbed.value.embed_url.split('/').pop() : undefined,
		}
	})

	return {
		filledField: filledEmbed,
		componentProps,
	}
}
