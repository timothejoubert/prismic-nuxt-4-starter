import { asText, type ImageField, type KeyTextField, type RichTextField } from '@prismicio/client'
import { joinURL } from 'ufo'
import type { ReachableDocument } from '~/types/api'
import { getFormattedLocale } from '~/composables/use-prismic-locale'
import type { PageMetaAlternateLink } from '~/composables/use-page-meta'
import { ensureProtocol } from '~/utils/url'
import { getSchemaOrgPrimaryImageId } from '~/utils/schema-org'
import { getPrismicImage, resolvePrismicImage } from '~/utils/prismic/image'
import { prismicDocumentType } from '#shared/prismic-schema'
import { I18N_DEFAULT_LOCALE } from '~~/i18n/i18n'

/** Fields a page type may expose: the SEO tab first, then the page's own content as fallback. */
interface PrismicDocumentPageData extends Record<string, unknown> {
    meta_title?: KeyTextField
    meta_description?: KeyTextField
    meta_image?: ImageField
    title?: KeyTextField
    content?: RichTextField
    image?: ImageField
}

export interface PrismicMetaOptions {
    /** schema.org `WebPage` subtype for this route (e.g. `CollectionPage`, `AboutPage`). Omit to let `nuxt-schema-org` emit its default `WebPage` node. */
    schemaOrgType?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ItemPage'
    /** `@id` of the node this page is about (e.g. a `Person` or a `CreativeWork`). */
    mainEntityId?: string
}

export function usePrismicMeta(documentOrRef?: MaybeRefOrGetter<ReachableDocument | null | undefined>, options: PrismicMetaOptions = {}) {
    const doc = toRef(documentOrRef)
    const { site } = useRuntimeConfig().public
    const siteUrl = ensureProtocol(site.url)
    const generateImg = useImage()
    const route = useRoute()

    const docData = computed(() => doc.value?.data as PrismicDocumentPageData | undefined)

    const title = computed(() => {
        const pageTitle = docData.value?.meta_title || docData.value?.title
        return pageTitle ? `${pageTitle} | ${site.name}` : site.name
    })

    const description = computed(() => docData.value?.meta_description || asText(docData.value?.content) || undefined)

    const image = computed(() => {
        const prismicImage = getPrismicImage(docData.value?.meta_image) || getPrismicImage(docData.value?.image)
        if (!prismicImage) return joinURL(siteUrl, '/share.jpg')

        // Social crawlers don't all support AVIF/WebP, hence a forced JPEG, at the 1200×630 size Open Graph recommends
        const { src, modifiers } = resolvePrismicImage(prismicImage, { width: 1200, height: 630, format: 'jpg', quality: 80 })

        return generateImg(src, modifiers, { provider: 'imgix' })
    })

    const noindex = usePrismicPreviewRoute().isPreview
    // The served route, not Prismic's doc.url: a type mapped to several routes can't be disambiguated from doc.url.
    const canonicalUrl = computed(() => joinURL(siteUrl, route.path || doc.value?.url || ''))

    const alternateLinks = computed<PageMetaAlternateLink[]>(() => {
        const alts = [
            ...(doc.value?.alternate_languages || []),
            { id: 'default', type: doc.value?.type || '', lang: I18N_DEFAULT_LOCALE },
        ]
        return alts.map((alt) => {
            const formattedLocale = getFormattedLocale(alt.lang)
            const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale
            return {
                locale: alt.lang,
                href: joinURL(siteUrl, locale || '', route.path),
            }
        })
    })

    const ogType = computed(() => doc.value?.type === prismicDocumentType.PROJECT_PAGE ? 'article' : 'website')

    const { head } = usePageMeta({ title, description, image, ogType, canonicalUrl, alternateLinks, noindex })
    useHead(head)

    if (options.schemaOrgType && !noindex.value) {
        // Explicit `@id`: auto-numbered image ids (`#/schema/image/1`) point to different images from one page to another
        const imageId = getSchemaOrgPrimaryImageId(canonicalUrl.value)

        useSchemaOrg([
            defineImage({ '@id': imageId, 'url': image.value }),
            // `name`, `description` and `url` are inherited by nuxt-schema-org from the head set above
            defineWebPage({
                '@type': options.schemaOrgType,
                'image': { '@id': imageId },
                'mainEntity': options.mainEntityId ? { '@id': options.mainEntityId } : undefined,
            }),
        ])
    }

    return { title, description, image, canonicalUrl, alternateLinks, noindex }
}
