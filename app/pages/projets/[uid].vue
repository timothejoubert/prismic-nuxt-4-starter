<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE, { meta: { schemaOrgType: 'ItemPage' } })
</script>

<template>
    <VPageWrapper>
        <VProjectPage
            v-if="document"
            :document="document"
        />
    </VPageWrapper>
</template>
