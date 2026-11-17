import svgLoader from 'vite-svg-loader'
import { PREVIEW_PATH } from './app/constants/prismic-preview'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './i18n/i18n'
import { version } from './package.json'
import { repositoryName } from './prismic.config.json'
import { getPrismicAliasRedirects, prismicDocumentRoutes } from './shared/prismic-schema'
import { getPrismicSitemapUrls } from './shared/prismic-sitemap-urls'

const isProd = process.env.NUXT_PUBLIC_SITE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
const VIDEOJS_ELEMENTS = new Set(['media-i18n', 'video-player', 'video-skin', 'youtube-video', 'vimeo-video'])

export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@nuxtjs/prismic',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
        'nuxt-schema-org',
        '@vueuse/nuxt',
    ],
    devtools: { enabled: true },
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                // No crossorigin: Prismic images are fetched as no-cors <img>, a CORS connection wouldn't be reused
                { rel: 'preconnect', href: 'https://images.prismic.io' },
            ],
        },
    },
    css: ['~~/app/assets/scss/main.scss'],
    vue: {
        compilerOptions: {
            // Video.js 10 web components (VPrismicVideo): list each tag, never a prefix rule
            isCustomElement: tag => VIDEOJS_ELEMENTS.has(tag),
        },
    },
    // https://nuxtseo.com/site-config — shared by @nuxtjs/sitemap, @nuxtjs/robots and nuxt-schema-org
    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL,
        name: process.env.NUXT_PUBLIC_SITE_NAME,
    },
    runtimeConfig: {
        public: {
            version,
            // Overridden by NUXT_PUBLIC_SITE_* env variables (see .env.sample)
            site: {
                name: '',
                url: '',
                env: '',
            },
        },
    },
    // Only applied when a server runs: with `pnpm generate` (static), headers and redirects go in the host's config.
    routeRules: {
        // Redirect prismicDocumentRoutes' `alias` paths (e.g. /projects) to their canonical route.
        ...getPrismicAliasRedirects(),
        '/**': {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            },
        },
    },
    experimental: {
        asyncContext: true,
    },
    compatibilityDate: '2025-07-15',
    nitro: {
        // Pinned so `pnpm generate` outputs the same directory (dist) locally and on Netlify,
        // instead of relying on Nitro's env-based detection (only active on Netlify's build servers).
        preset: 'netlify-static',
        prerender: {
            // Redirect routes (aliases) must NOT be prerendered: their meta-refresh stub `.html`
            // would shadow the real 301 rule Netlify reads from `_redirects`.
            ignore: [(path: string) => path in getPrismicAliasRedirects()],
            // Flat `page.html` files instead of `page/index.html`: Netlify 301-redirects a bare `/page`
            // to `/page/` when a directory exists, which conflicts with canonical URLs (no trailing slash).
            autoSubfolderIndex: false,
        },
    },
    vite: {
        build: {
            // If the generated svg-sprite file is under 4kb, the build process converts it to an inlined base64 file,
            // which breaks the use of icons.
            assetsInlineLimit: 0,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "assets/scss/_resources.scss" as *;',
                    quietDeps: true,
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
            svgLoader({
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeTitle: false,
                                    // viewBox is required to resize SVGs with CSS.
                                    // @see https://github.com/svg/svgo/issues/1128
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                defaultImport: 'url',
            }),
        ],
    },
    typescript: {
        // TS 6+ no longer auto-includes every @types package — nuxt.config.ts needs Node's `process` types.
        nodeTsConfig: {
            compilerOptions: {
                types: ['node'],
            },
        },
    },
    postcss: {
        plugins: {
            // https://github.com/cuth/postcss-pxtorem?tab=readme-ov-file#options
            'postcss-pxtorem': {
                propList: ['*'],
                exclude: /(node_modules|scss\/export)/i,
            },
        },
    },
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: true,
        },
    },
    // https://i18n.nuxtjs.org/docs/getting-started/usage
    i18n: {
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
        },
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        compilation: {
            strictMessage: false, // Message can contains HTML tag
        },
    },
    // https://nuxt.com/modules/icon#usage
    icon: {
        componentName: 'NuxtIcon',
        // Local SVGs only: no runtime API fetch, which doesn't exist once the site is deployed as a static build.
        fallbackToApi: false,
        customCollections: [
            {
                normalizeIconName: false,
                prefix: 'icon',
                dir: './app/assets/images/icons',
            },
        ],
    },
    // https://image.nuxt.com/get-started/configuration
    image: {
        // Every image comes from Prismic (served by imgix) — also types useImage() options against it.
        provider: 'imgix',
        imgix: {
            baseURL: '',
        },
        quality: 75,
        screens: {
            xs: 375, // override nuxt/img sizes to match our breakpoints
            sm: 480, // override
            vl: 1280, // override
            xl: 1440, // override
            xxl: 1600, // override
            hd: 1920, // additional size
            qhd: 2500, // additional size
        },
        // @ts-expect-error not working with [1]
        densities: '1',
        presets: {
            default: {
                sizes: 'xs:100vw md:100vw lg:100vw vl:100vw xl:100vw hd:100vw qhd:100vw',
            },
        },
    },
    prismic: {
        endpoint: repositoryName,
        preview: PREVIEW_PATH,
        toolbar: !isProd,
        clientConfig: {
            routes: [...prismicDocumentRoutes],
        },
    },
    // https://nuxtseo.com/robots/getting-started/introduction
    robots: {
        disallow: [PREVIEW_PATH, '/slice-simulator'],
    },
    // https://nuxtseo.com/sitemap/getting-started/introduction
    sitemap: {
        exclude: [`${PREVIEW_PATH}/**`, '/slice-simulator'],
        urls: () => getPrismicSitemapUrls(repositoryName),
    },
})
