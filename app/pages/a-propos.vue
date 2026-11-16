<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ABOUT_PAGE)
</script>

<template>
    <main>
        <VAboutPage
            v-if="document"
            :document="document"
        />
    </main>
</template>
