<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ABOUT_PAGE, { meta: { schemaOrgType: 'AboutPage' } })
</script>

<template>
    <VPageWrapper>
        <VAboutPage
            v-if="document"
            :document="document"
        />
    </VPageWrapper>
</template>
