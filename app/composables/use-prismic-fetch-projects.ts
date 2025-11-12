import type { GetAllByTypeParams } from '~/composables/use-prismic-fetch-document-listing'

export function usePrismicFetchProjects(
	archived = false,
	options: GetAllByTypeParams = {},
) {
	const { $prismic } = useNuxtApp()
	const prismicFilter = $prismic.filter

	return usePrismicFetchDocuments('project_page', {
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
		filters: [prismicFilter.at('my.project_page.archived', archived)],
		...options,
	})
}
