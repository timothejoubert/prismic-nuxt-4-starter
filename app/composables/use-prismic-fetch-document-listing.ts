import type { RepeatableDocument } from '~/types/api'
import { generateHashFromObject } from '~/utils/hash'

type PrismicClient = ReturnType<typeof usePrismic>['client']
export type GetAllByTypeParams = Parameters<PrismicClient['getAllByType']>[1]

export type RepeatableDocumentType = RepeatableDocument['type']

export function usePrismicFetchDocumentListing(
    prismicDocument: RepeatableDocumentType,
    options: MaybeRefOrGetter<GetAllByTypeParams> = {},
) {
    const prismicClient = usePrismic().client
    const { fetchLocaleOption } = useLocale()

    // Route resolution comes from the client config (nuxt.config.ts `prismic.clientConfig.routes`).
    const fetchOptions = computed(() => ({
        brokenRoute: '/404',
        ...fetchLocaleOption.value,
        ...toValue(options),
    }))

    const key = `documents-${prismicDocument}-${generateHashFromObject(fetchOptions.value)}`

    return useAsyncData(key, () => prismicClient.getAllByType(prismicDocument, fetchOptions.value), {
        // Only reuse cached data for the component's initial fetch, not for `watch`-triggered
        // refetches: otherwise changing `fetchOptions` (e.g. a sort ordering) would re-serve the
        // stale cached list instead of actually refetching.
        getCachedData: (key, nuxtApp, ctx) => {
            if (ctx.cause !== 'initial') return undefined
            return nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key]
        },
        deep: false,
        watch: [fetchOptions],
    })
}
