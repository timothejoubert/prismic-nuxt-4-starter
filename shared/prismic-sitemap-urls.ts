import { createClient, isFilled } from '@prismicio/client'
import { getRoutePath, prismicDocumentType } from './prismic-schema'

/**
 * Dynamic sitemap entries for Prismic content. Static page routes are auto-discovered by
 * @nuxtjs/sitemap from app/pages: only repeatable documents (resolved by uid) need listing here.
 */
export async function getPrismicSitemapUrls(repositoryName: string) {
    const client = createClient(repositoryName)
    const projects = await client.getAllByType(prismicDocumentType.PROJECT_PAGE)

    return projects.map(doc => ({
        loc: getRoutePath('project', { uid: doc.uid }),
        lastmod: new Date(doc.last_publication_date).toISOString(),
        images: isFilled.image(doc.data.image) ? [{ loc: doc.data.image.url }] : undefined,
    }))
}
