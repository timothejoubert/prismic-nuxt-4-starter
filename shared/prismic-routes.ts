import { HOME_PAGE_TYPE, ARCHIVE_TYPE, ABOUT_TYPE, PROJECT_LISTING_TYPE, PROJECT_TYPE } from './prismic-documents'

export const prismicDocumentRoutes = {
	[HOME_PAGE_TYPE]: {
		name: 'index',
		type: HOME_PAGE_TYPE,
		path: '/:lang?',
	},
	[ARCHIVE_TYPE]: {
		name: 'archive',
		type: ARCHIVE_TYPE,
		path: '/:lang?/archive',
	},
	[ABOUT_TYPE]: {
		name: 'about',
		type: ABOUT_TYPE,
		path: '/:lang?/a-propos',
	},
	[PROJECT_LISTING_TYPE]: {
		name: 'projets',
		type: PROJECT_LISTING_TYPE,
		path: '/:lang?/projets',
	},
	[PROJECT_TYPE]: {
		name: 'projet',
		type: PROJECT_TYPE,
		path: '/:lang?/projets/:uid',
	},
 } as const

export const prismicRouteList = Object.values(prismicDocumentRoutes)

export type PrismicDocumentRoutes = typeof prismicRouteList
export type PrismicDocumentRoute = PrismicDocumentRoutes[number]
export type PrismicDocumentType = PrismicDocumentRoute['type']

export function getPrismicRoute(type: PrismicDocumentType) {
	return prismicDocumentRoutes[type]
}

export function isDynamicDocument(type: string) {
	const route = prismicDocumentRoutes[type as PrismicDocumentType]
	return !!route?.path?.includes(':uid')
}
