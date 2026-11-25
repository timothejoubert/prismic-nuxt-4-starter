import { describe, expect, it } from 'vitest'
import { getImgixSource, resolvePrismicImage, type PrismicImage } from '~/utils/prismic/image'

// A 2400 × 1200 (2 / 1) Prismic image, with the params Prismic puts in its URLs
const image: PrismicImage = {
    ...getImgixSource('https://images.prismic.io/repo/river.jpg?auto=compress,format&rect=0,0,2400,1200&w=2400&h=1200'),
    width: 2400,
    height: 1200,
    alt: '',
}

describe('getImgixSource', () => {
    it('splits the URL from its params, without w and h', () => {
        expect(getImgixSource('https://images.prismic.io/repo/a.jpg?auto=compress,format&rect=0,0,10,10&w=10&h=10'))
            .toEqual({ src: 'https://images.prismic.io/repo/a.jpg', modifiers: { auto: 'compress,format', rect: '0,0,10,10' } })
    })

    it('reads the malformed query of a link to media image once', () => {
        expect(getImgixSource('https://images.prismic.io/repo/a.avif?auto=format,compress?auto=compress,format'))
            .toEqual({ src: 'https://images.prismic.io/repo/a.avif', modifiers: { auto: 'format,compress' } })
    })

    it('keeps a URL without params', () => {
        expect(getImgixSource('https://images.prismic.io/repo/a.jpg')).toEqual({ src: 'https://images.prismic.io/repo/a.jpg', modifiers: {} })
    })
})

describe('resolvePrismicImage', () => {
    describe('size', () => {
        it('keeps the image size when none is given', () => {
            expect(resolvePrismicImage(image)).toMatchObject({ width: 2400, height: 1200 })
        })

        it('keeps the image ratio from a width alone', () => {
            const resolved = resolvePrismicImage(image, { width: 800 })

            expect(resolved).toMatchObject({ width: 800, height: 400 })
            expect(resolved.modifiers).toMatchObject({ width: 800, height: 400 })
        })

        it('keeps the image ratio from a height alone', () => {
            expect(resolvePrismicImage(image, { height: 300 })).toMatchObject({ width: 600, height: 300 })
        })

        it('crops to width + height', () => {
            expect(resolvePrismicImage(image, { width: '800', height: '800' })).toMatchObject({ width: 800, height: 800 })
        })

        it('ignores empty or invalid dimensions', () => {
            expect(resolvePrismicImage(image, { width: '', height: 0 })).toMatchObject({ width: 2400, height: 1200 })
        })
    })

    describe('fit', () => {
        it('defaults to cover', () => {
            expect(resolvePrismicImage(image).modifiers.fit).toBe('cover')
        })

        it('takes the given fit', () => {
            expect(resolvePrismicImage(image, { fit: 'contain' }).modifiers.fit).toBe('contain')
        })
    })

    describe('format', () => {
        it('keeps Prismic auto=compress,format without a format', () => {
            const { modifiers } = resolvePrismicImage(image)

            expect(modifiers.auto).toBe('compress,format')
            expect(modifiers).not.toHaveProperty('format')
        })

        it('drops auto=format, which would win over fm, and keeps compress', () => {
            const { modifiers } = resolvePrismicImage(image, { format: 'jpg' })

            expect(modifiers.format).toBe('jpg')
            expect(modifiers.auto).toBe('compress')
        })

        it('drops auto when format was its only value', () => {
            const { modifiers } = resolvePrismicImage({ ...image, modifiers: { auto: 'format' } }, { format: 'png' })

            expect(modifiers).not.toHaveProperty('auto')
        })

        it('drops auto=format too when fm comes from modifiers', () => {
            const { modifiers } = resolvePrismicImage(image, { modifiers: { fm: 'webp' } })

            expect(modifiers).toMatchObject({ format: 'webp', auto: 'compress' })
            expect(modifiers).not.toHaveProperty('fm')
        })
    })

    describe('merge order', () => {
        it('keeps the params Prismic put in the URL but its w and h', () => {
            const { modifiers } = resolvePrismicImage(image, { width: 800 })

            expect(modifiers.rect).toBe('0,0,2400,1200')
            expect(modifiers).not.toHaveProperty('w')
            expect(modifiers).not.toHaveProperty('h')
        })

        it('lets the named options override the Prismic params', () => {
            const { modifiers } = resolvePrismicImage({ ...image, modifiers: { q: '50' } }, { quality: 80 })

            expect(modifiers.quality).toBe(80)
            expect(modifiers).not.toHaveProperty('q')
        })

        it('lets modifiers override the named options', () => {
            const { modifiers } = resolvePrismicImage(image, { format: 'jpg', quality: 80, modifiers: { fm: 'png', q: 60, sat: -100 } })

            expect(modifiers).toMatchObject({ format: 'png', quality: 60, sat: -100 })
        })

        it('joins list params, which @nuxt/image would otherwise repeat', () => {
            const { modifiers } = resolvePrismicImage(image, { modifiers: { crop: ['faces', 'entropy'] } })

            expect(modifiers.crop).toBe('faces,entropy')
        })

        it('leaves out the options not given', () => {
            const { modifiers } = resolvePrismicImage(image)

            expect(Object.values(modifiers)).not.toContain(undefined)
        })
    })
})
