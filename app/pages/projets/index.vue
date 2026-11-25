<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_LISTING_PAGE, { meta: { schemaOrgType: 'CollectionPage' } })
</script>

<template>
    <VPageWrapper>
        <VProjectListingPage
            v-if="document"
            :document="document"
        />
    </VPageWrapper>
</template>
