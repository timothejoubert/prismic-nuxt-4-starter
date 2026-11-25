import { describe, expect, it } from 'vitest'
import { getVideoBoxRatio, parsePrismicMedia, parsePrismicVideoMedia } from '~/utils/prismic/media'

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

describe('getVideoBoxRatio', () => {
    const youtube = parsePrismicVideoMedia(embed)
    const vimeo = parsePrismicVideoMedia({ embed_url: 'https://vimeo.com/76979871', html: '<iframe></iframe>', width: 640, height: 360 })
    const short = parsePrismicVideoMedia({ embed_url: 'https://www.youtube.com/shorts/1myVmc3mNtU', html: '<iframe></iframe>', width: 200, height: 150 })
    const youtubeSized = parsePrismicVideoMedia({ ...embed, width: 200, height: 150 })

    it('takes width + height first', () => {
        expect(getVideoBoxRatio(vimeo, { width: 4, height: 3 }, { width: 1, height: 1 })).toBe('4 / 3')
    })

    it('takes a Vimeo embed\'s dimensions', () => {
        expect(getVideoBoxRatio(vimeo, {})).toBe('640 / 360')
    })

    it('never takes YouTube\'s oEmbed dimensions (its thumbnail\'s)', () => {
        expect(getVideoBoxRatio(youtubeSized, {}, { width: 16, height: 9 })).toBe('16 / 9')
    })

    it('is 9 / 16 for a YouTube Short', () => {
        expect(getVideoBoxRatio(short, {})).toBe('9 / 16')
    })

    it('is undefined (CSS 16 / 9) with nothing known', () => {
        expect(getVideoBoxRatio(youtube, {})).toBeUndefined()
    })
})
