// No `~` import: nuxt.config.ts imports this file, where the alias isn't resolved

/** @nuxt/image screens (breakpoints, px), the single list: nuxt.config.ts `image.screens` uses it too. */
export const IMAGE_SCREENS = {
    xs: 375,
    sm: 480,
    md: 768,
    lg: 1024,
    vl: 1280,
    xl: 1440,
    xxl: 1600,
    hd: 1920,
    qhd: 2500,
} as const

export type ImageScreen = keyof typeof IMAGE_SCREENS

/**
 * NuxtImg `sizes` listing every breakpoint. @nuxt/image yields one image width per key, computed at that
 * breakpoint (its lower bound): a breakpoint left out leaves a range served by a too small image. Each
 * breakpoint takes the value of the closest one given at or below it.
 * @example getImageSizes({ xs: '100vw', md: '33vw' }) // 'xs:100vw sm:100vw md:33vw lg:33vw … qhd:33vw'
 */
export function getImageSizes(sizes: Partial<Record<ImageScreen, string>>) {
    let current: string | undefined

    return (Object.keys(IMAGE_SCREENS) as ImageScreen[]).flatMap((screen) => {
        current = sizes[screen] ?? current

        return current ? [`${screen}:${current}`] : []
    }).join(' ')
}

const IMAGE_OPTION_KEYS = ['sizes', 'densities', 'fit', 'format', 'quality', 'preset'] as const

type ImageOptionKey = typeof IMAGE_OPTION_KEYS[number]

/** The NuxtImg options (but size and modifiers) of `options`, e.g. a component's props. */
export function pickImageOptions<Options extends Partial<Record<ImageOptionKey, unknown>>>(options: Options) {
    return Object.fromEntries(IMAGE_OPTION_KEYS.map(key => [key, options[key]])) as Pick<Options, ImageOptionKey>
}
