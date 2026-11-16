<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ARCHIVE_PAGE)
usePrismicMeta(document, { schemaOrgType: 'CollectionPage' })
</script>

<template>
    <main>
        <VArchivePage
            v-if="document"
            :document="document"
        />
    </main>
</template>
