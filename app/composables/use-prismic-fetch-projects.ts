import { filter } from '@prismicio/client'
import type { GetAllByTypeParams } from '~/composables/use-prismic-fetch-document-listing'
import { prismicDocumentType } from '~~/shared/prismic-schema'

export function usePrismicFetchProjects(archived = false, options: GetAllByTypeParams = {}) {
    return usePrismicFetchDocumentListing(prismicDocumentType.PROJECT_PAGE, {
        orderings: [
            {
                field: 'my.project_page.publication_date',
                direction: 'desc',
            },
            {
                field: 'my.project_page.creation_date',
                direction: 'desc',
            },
        ],
        filters: [filter.at('my.project_page.archived', archived)],
        ...options,
    })
}
