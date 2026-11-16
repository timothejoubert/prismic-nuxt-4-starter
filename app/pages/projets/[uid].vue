<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE)
usePrismicMeta(document, { schemaOrgType: 'ItemPage' })
</script>

<template>
    <main>
        <VProjectPage
            v-if="document"
            :document="document"
        />
    </main>
</template>
