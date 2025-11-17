import type { LocationAsRelativeRaw, _RouteRecordBase } from 'vue-router'
import type { ContentRelationshipField } from '@prismicio/types'
import type { PrismicReachableDocumentType, ReachableDocument } from '~/types/api'
import { getPrismicRoute, type PrismicDocumentRoute } from '~~/shared/prismic-routes'

export type PossibleRouteReference
	= | string
		| undefined
		| null
		| LocationAsRelativeRaw
		| _RouteRecordBase
		| ReachableDocument
		| ContentRelationshipField<PrismicReachableDocumentType>
		| PrismicDocumentRoute

function isDocumentReference(reference: PossibleRouteReference) {
	return typeof reference === 'object'
			&& 'type' in reference
			&& 'url' in reference
}

function isRouteWithoutUrl(reference: PossibleRouteReference) {
	return typeof reference === 'object'
			&& 'type' in reference
			&& 'path' in reference
			&& !('url' in reference)
			&& getPrismicRoute(reference.type)
}

export function useLinkResolver(reference: PossibleRouteReference) {
	const siteUrl = useRuntimeConfig().public?.site.url
	const router = useRouter()
	const { getLocalizedUrl } = useLocale()

	const url = computed(() => {
		if (!reference) {
			return undefined
		}
		else if (isRouteWithoutUrl(reference)) {

			return getLocalizedUrl(reference.path?.replace('/:lang?', ''))
		}
		else if (isDocumentReference(reference)) {

			return getLocalizedUrl(reference.url?.replace('/:lang?', ''))
		}
		else if (typeof reference === 'string') {
			const hasLang = reference.includes('/:lang?')
			if (!hasLang) return reference

			return getLocalizedUrl(reference.replace('/:lang?', ''))
		}
		else if (typeof reference === 'object' && 'url' in reference) {
			return reference.url
		}
		else if (typeof reference === 'object' && 'name' in reference) {
			return router.hasRoute(reference.name as string)
				? router.resolve(reference)?.fullPath
				: undefined
		}
	})


	const isRelative = computed(() => {
		if (!url.value) return false

		const startWithSiteUrl = !!siteUrl && !!url.value?.startsWith(siteUrl)

		return (
			url.value.charAt(0) === '/'
			|| url.value.charAt(0) === '#'
			|| startWithSiteUrl
		)
	})

	const isExternal = computed(() => !!url.value && !isRelative.value)

	return { isRelative, isExternal, url }
}
