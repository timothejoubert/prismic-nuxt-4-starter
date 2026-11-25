import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

// Two projects (@nuxt/test-utils layout): `unit` runs pure modules in Node, fast and without Nuxt;
// `nuxt` boots a Nuxt environment for composables and components.
export default defineConfig({
    test: {
        passWithNoTests: true,
        projects: [
            {
                resolve: {
                    alias: {
                        '~': fileURLToPath(new URL('./app', import.meta.url)),
                        '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
                    },
                },
                test: {
                    name: 'unit',
                    include: ['test/unit/**/*.test.ts'],
                    environment: 'node',
                },
            },
            await defineVitestProject({
                test: {
                    name: 'nuxt',
                    include: ['test/nuxt/**/*.test.ts'],
                    environment: 'nuxt',
                },
            }),
        ],
    },
})
