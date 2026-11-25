import { describe, expect, it } from 'vitest'
import { parsePrismicMedia } from '~/utils/prismic/media'

const image = { url: 'https://images.prismic.io/repo/a.jpg?auto=compress,format', dimensions: { width: 10, height: 10 }, alt: null, copyright: null }
const mediaLink = (name: string, kind = 'file') => ({ link_type: 'Media', key: 'k', id: 'i', url: `https://prismic-io.s3.amazonaws.com/repo/${name}`, name, kind, size: '1' })
const embed = { embed_url: 'https://www.youtube.com/watch?v=1myVmc3mNtU', html: '<iframe></iframe>' }

describe('parsePrismicMedia', () => {
    it('reads an image field', () => {
        expect(parsePrismicMedia(image)?.kind).toBe('image')
    })

    it('reads a video file link', () => {
        expect(parsePrismicMedia(mediaLink('a.mp4'))).toMatchObject({ kind: 'video', video: { type: 'video/mp4' } })
    })

    it('reads an embed', () => {
        expect(parsePrismicMedia(embed)).toMatchObject({ kind: 'embed', embed: { source: { platform: 'youtube' } } })
    })

    it('is undefined for an empty field or another file', () => {
        expect(parsePrismicMedia({ link_type: 'Media' })).toBeUndefined()
        expect(parsePrismicMedia(mediaLink('a.pdf'))).toBeUndefined()
        expect(parsePrismicMedia(null)).toBeUndefined()
    })
})
