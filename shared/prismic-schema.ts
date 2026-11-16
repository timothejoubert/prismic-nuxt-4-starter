import type { AllDocumentTypes } from '../prismicio-types'

type PrismicDocumentType = AllDocumentTypes['type']

/**
 * Single source of truth for every Prismic document type used in the app: its identity (friendly
 * name) and, if it's a routable page, its route(s). To add a new document type to the site:
 * 1. Create the custom type in Prismic, run `pnpm type-gen`.
 * 2. Add a friendly constant to `prismicDocumentType` below.
 * 3. If it's a routable page, add an entry to `prismicDocumentRoutes` below.
 * `PrismicDocumentPageType` and `isDynamicDocument` derive from `prismicDocumentRoutes`
 * automatically — no other manual wiring needed. `pnpm type-gen` also regenerates
 * `prismic.config.json`'s `routes` field from `prismicDocumentRoutes` (via
 * `scripts/sync-prismic-routes.js`) — never hand-edit that field, it's a generated artifact.
 */

/**
 * Friendly named constants for every Prismic document type used in the app (routable pages and
 * singleton config documents like `settings`/`menu` alike). `satisfies` ties each value back to
 * the generated `prismicio-types.d.ts` document types (same as `PrismicDocumentType` in `app/types/api.ts`,
 * which can't be imported here: this file is also loaded by nuxt.config.ts, outside the app's aliases), so a
 * renamed/removed custom type fails to compile here instead of silently going stale.
 */
export const prismicDocumentType = {
    HOME_PAGE: 'home_page',
    ABOUT_PAGE: 'about_page',
    ARCHIVE_PAGE: 'archive_page',
    PROJECT_LISTING_PAGE: 'project_listing_page',
    PROJECT_PAGE: 'project_page',
    SETTINGS: 'settings',
    MENU: 'menu',
} as const satisfies Record<string, PrismicDocumentType>

export const prismicDocumentRoutes = [
    {
        name: 'index',
        type: prismicDocumentType.HOME_PAGE,
        path: '/:lang?',
    },
    {
        name: 'about',
        type: prismicDocumentType.ABOUT_PAGE,
        path: '/:lang?/a-propos',
    },
    {
        name: 'archive',
        type: prismicDocumentType.ARCHIVE_PAGE,
        path: '/:lang?/archive',
    },
    {
        name: 'projects',
        type: prismicDocumentType.PROJECT_LISTING_PAGE,
        path: '/:lang?/projets',
        alias: ['/:lang?/projects'],
    },
    {
        name: 'project',
        type: prismicDocumentType.PROJECT_PAGE,
        path: '/:lang?/projets/:uid',
    },
] as const

export type PrismicDocumentRoutes = typeof prismicDocumentRoutes
export type PrismicDocumentRoute = PrismicDocumentRoutes[number]
export type PrismicRouteName = PrismicDocumentRoute['name']

/** Lookup by route name (collision-free, unlike a lookup by type: several routes can share a type). */
export const prismicRouteByName = prismicDocumentRoutes.reduce((acc, route) => {
    Object.assign(acc, { [route.name]: route })
    return acc
}, {} as Record<PrismicRouteName, PrismicDocumentRoute>)

/**
 * Resolved path of a Prismic route, derived from prismicDocumentRoutes (single source of truth).
 * @example getRoutePath('archive')                 // '/archive'
 * @example getRoutePath('project', { uid: 'foo' }) // '/projets/foo'
 */
export function getRoutePath(name: PrismicRouteName, params?: Record<string, string>): string {
    const route = prismicRouteByName[name]
    let path = (route.path as string).replace('/:lang?', '') || '/'

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, value)
        }
    }

    return path
}

export function isPrismicDocumentRoute(route: object): route is PrismicDocumentRoute {
    const type = 'type' in route && typeof route.type === 'string' && route.type
    const hasPath = 'path' in route && typeof route.path === 'string' && !!route.path

    return hasPath && prismicDocumentRoutes.some(r => r.type === type)
}

/** Routable page types — derived from prismicDocumentRoutes, not hand-listed. */
export type PrismicDocumentPageType = PrismicDocumentRoute['type']

/** A document type is "dynamic" (repeatable, fetched by uid) when at least one of its routes carries a `:uid` param — adding a new repeatable type only requires registering its route above. */
export function isDynamicDocument(type: PrismicDocumentType) {
    return prismicDocumentRoutes.some(route => route.type === type && route.path.includes(':uid'))
}

/**
 * Nuxt `routeRules` redirecting each route's `alias` path(s) to its canonical path (e.g. `/projects`
 * redirects to `/projets`), so aliases are real navigable/crawlable routes instead of
 * only being considered by `getDocumentTypeByUrl`'s fallback resolution in `useFetchPage`.
 * Static-friendly: works the same whether served (SSR) or prerendered (`nuxi generate`).
 * Note: only handles alias paths without dynamic segments (none currently need one).
 */
export function getPrismicAliasRedirects(): Record<string, { redirect: string }> {
    const rules: Record<string, { redirect: string }> = {}

    for (const route of prismicDocumentRoutes) {
        if (!('alias' in route) || !route.alias?.length) continue

        const target = getRoutePath(route.name)
        for (const alias of route.alias) {
            const literalAlias = alias.replace('/:lang?', '') || '/'
            rules[literalAlias] = { redirect: target }
        }
    }

    return rules
}
