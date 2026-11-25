import type { ReachableDocument } from '~/types/api'
import type { PrismicMetaOptions } from '~/composables/use-prismic-meta'
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { PrismicDocumentPageType } from '~~/shared/prismic-schema'

interface FetchPageOptions {
    fatal?: boolean
    /** Page meta, SEO and schema.org (`usePrismicMeta`), set for every page fetched */
    meta?: PrismicMetaOptions
}

/** Fetches the Prismic document of a page and sets its meta: a page can't forget the second step. */
export async function useFetchPage<T extends PrismicDocumentPageType>(type: T | undefined, options?: FetchPageOptions) {
    const route = useRoute()
    const documentType = (type || getDocumentTypeByUrl(route.path)) as T | undefined
    const { isPreview } = usePrismicPreviewRoute()
    const fatal = options?.fatal ?? true
    // Called before the first await, where the Nuxt context is still there; filled once the document is fetched
    const metaDocument = shallowRef<ReachableDocument | null>()
    usePrismicMeta(metaDocument, options?.meta)

    if (!documentType && !isPreview.value) {
        throw showError({
            message: 'can\'t find prismic document to display during use-fetch-page',
            statusCode: 404,
        })
    }

    const { data, error } = await usePrismicFetchDocument<T>(documentType)

    if (error.value) {
        if (!fatal) {
            setResponseStatus(error.value.statusCode ?? 404)
            return {
                document: data,
                documentType,
            }
        }

        throw showError(error.value)
    }

    usePage({ document: data.value })
    metaDocument.value = data.value as ReachableDocument | null

    return {
        document: data,
        documentType,
    }
}
