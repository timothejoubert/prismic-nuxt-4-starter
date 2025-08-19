import type { AllDocumentTypes } from '~~/prismicio-types'
import type { PrismicDocumentType } from '~/types/api'
import { isDynamicDocument, isExistingDocumentType } from '~/utils/prismic/document-type'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'

export async function usePrismicFetchDocument<T extends AllDocumentTypes>(documentType: PrismicDocumentType | undefined) {
    const route = useRoute()
    const routeUid = route.params?.uid || ''
    const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage

    const { documentId, isPreview } = usePrismicPreviewRoute()

    const dataKey = `page-${documentType}-${uid || documentId.value || 'single-document'}`

    const prismicClient = usePrismic().client
    const { fetchLocaleOption } = useLocale()

    const prismicFetchOptions = {
        ...fetchLocaleOption.value,
        brokenRoute: '/404',
    }

    console.log()
    const { data, error } = await useAsyncData(dataKey, async () => {
        try {
            if (isPreview.value && documentId.value) {
                return await prismicClient.getByID(documentId.value, prismicFetchOptions)
            }
            else if (uid && documentType && isDynamicDocument(documentType)) {
                return await prismicClient.getByUID(documentType, uid, prismicFetchOptions)
            }
            else if (documentType) {
                return await prismicClient.getSingle(documentType, prismicFetchOptions)
            }
        } catch (error) {
            console.error('Error during Prismic document fetch', error);
            return { data: null }
        }
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key],
        dedupe: 'defer',
        deep: false,
    })

    return {
        data: computed(() => data.value as T),
        error,
    }
}
