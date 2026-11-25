<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'
import { SKIP_LINKS } from '~/constants/skip-links'

const { data } = await usePrismicFetchDocument(prismicDocumentType.SETTINGS)
</script>

<template>
    <footer
        role="contentinfo"
        :class="$style.root"
        class="grid-container"
        :id="SKIP_LINKS.footer.elementId"
    >
        <p :class="$style.year">© {{ new Date().getFullYear() }}</p>
        <VPrismicLink :class="$style.credits" href="#" label="test" />
    </footer>
</template>

<style lang="scss" module>
.root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
}

.year {
    margin: 0;
    display: inline-block;
}

.credits {
    margin: 0;
}
</style>
