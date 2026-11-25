import mainFontUrl from '~/assets/fonts/tt-norms-pro-regular-subset.woff2?url'


export default defineNuxtPlugin({
    parallel: true,
    async setup() {
        // Body text and headings fonts, discovered late through the CSS otherwise
        useHead({
            link: [{
                rel: 'preload',
                as: 'font',
                type: 'font/woff2',
                href: mainFontUrl,
                crossorigin: ''
            }],
        })

    },
})
