<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.HOME_PAGE, { meta: { schemaOrgType: 'CollectionPage' } })
</script>

<template>
    <VPageWrapper>
        <VHomePage
            v-if="document"
            :document="document"
        />
    </VPageWrapper>
</template>
