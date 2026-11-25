import { describe, expect, it } from 'vitest'
import { getAspectRatio, getHeightForWidth } from '~/utils/media/aspect-ratio'

describe('getAspectRatio', () => {
    it('returns a CSS ratio from both dimensions', () => {
        expect(getAspectRatio(1600, '900')).toBe('1600 / 900')
    })

    it('is undefined when a dimension is missing or not positive', () => {
        expect(getAspectRatio(1600, undefined)).toBeUndefined()
        expect(getAspectRatio(0, 900)).toBeUndefined()
    })
})

describe('getHeightForWidth', () => {
    it('keeps the ratio', () => {
        expect(getHeightForWidth(800, 1600, 900)).toBe(450)
    })

    it('is undefined when the ratio is unknown', () => {
        expect(getHeightForWidth(800, undefined, 900)).toBeUndefined()
    })
})
