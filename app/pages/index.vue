<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.HOME_PAGE)
</script>

<template>
    <main>
        <VHomePage
            v-if="document"
            :document="document"
        />
    </main>
</template>
