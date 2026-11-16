<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_LISTING_PAGE)
usePrismicMeta(document, { schemaOrgType: 'CollectionPage' })
</script>

<template>
    <main>
        <VProjectListingPage
            v-if="document"
            :document="document"
        />
    </main>
</template>
