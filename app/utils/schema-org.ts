/** `@id` of a page's main image, scoped to that page's canonical URL (nuxt-schema-org would otherwise number it by position in each page's graph). */
export function getSchemaOrgPrimaryImageId(canonicalUrl: string) {
    return `${canonicalUrl}#primaryimage`
}
