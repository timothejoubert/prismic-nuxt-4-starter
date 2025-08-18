import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { PrismicDocumentType, ReachableDocument } from '~/types/api'

export async function useFetchPage<T extends ReachableDocument>(type: PrismicDocumentType | undefined) {
    const route = useRoute()

    const documentType = computed(() => {
        return type || getDocumentTypeByUrl(route.path)
    })

    const { isPreview } = usePrismicPreviewRoute()

    if (!documentType.value && !isPreview.value) {
        throw createError({ message: 'can\'t interpret route name during page fetch', status: 500 })
    }

    const { data, error } = await usePrismicFetchDocument<T>(documentType.value)

    if (error.value) {
        throw showError(error.value)
    }

    // const currentPage = useCurrentPage()
    // currentPage.value = {
    //     document: data.value,
    // }

    if (data.value) {
        usePrismicHead(data.value)
        usePrismicSeoMeta(data.value)
    }

    return {
        document: data,
        documentType,
    }
}
