import { prismicDocumentRoutes, prismicDocumentName } from '~~/shared/prismic-routes'

export function isExistingDocumentType(type: string) {
    return !!prismicDocumentRoutes.find(route => route.type === type)
}

export function isHomeDocument(type: string) {
    return type === prismicDocumentName.home_page
}

export function isAboutDocument(type: string) {
    return type === prismicDocumentName.about_page
}

export function isArchiveDocument(type: string) {
    return type === prismicDocumentName.archive_page
}

export function isProjectListingDocument(type: string) {
    return type === prismicDocumentName.project_listing_page
}

export function isProjectDocument(type: string) {
    return type === prismicDocumentName.project_page
}

export function isDynamicDocument(type: string) {
    return isProjectDocument(type)
}
