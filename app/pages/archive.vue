<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ARCHIVE_PAGE, { meta: { schemaOrgType: 'CollectionPage' } })
</script>

<template>
    <VPageWrapper>
        <VArchivePage
            v-if="document"
            :document="document"
        />
    </VPageWrapper>
</template>
