import type { EmbedField } from '@prismicio/client'
import type { VVideoPlayerProps } from '~/components/VVideoPlayer.vue'

/** Maps a Prismic embed field to VVideoPlayer props (platform and video id). */
export function usePrismicEmbed(field: MaybeRefOrGetter<EmbedField | null | undefined>, props?: Partial<VVideoPlayerProps>) {
    const prismic = usePrismic()

    const filledField = computed(() => {
        const value = toValue(field)
        return prismic.isFilled.embed(value) ? value : undefined
    })

    const componentProps = computed<VVideoPlayerProps | undefined>(() => {
        if (!filledField.value) return

        return {
            ...props,
            title: props?.title || filledField.value.title || undefined,
            embedPlatform: filledField.value.provider_name?.toLowerCase(),
            embedId: filledField.value.embed_url?.split('/').pop(),
        }
    })

    return { filledField, componentProps }
}
