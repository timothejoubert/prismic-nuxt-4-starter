<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'
import { SKIP_LINKS } from '~/constants/skip-links'

const { data: settings } = await usePrismicFetchDocument(prismicDocumentType.SETTINGS)
</script>

<template>
    <footer
        role="contentinfo"
        :class="$style.root"
        class="grid-container"
        :id="SKIP_LINKS.footer.elementId"
    >
        <p :class="$style.year">© {{ new Date().getFullYear() }}</p>
        <template
            v-if="settings?.data?.credit"
        >
            <VPrismicLink
                v-for="(credit, index) in settings?.data?.credit"
                :to="credit?.url"
                :class="$style.credits"
                :key="credit.text ?? index"
                :label="credit.text ?? ''"
            />
        </template>
    </footer>
</template>

<style lang="scss" module>
.root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block: 42px 24px;
}

.year {
    margin: 0;
    display: inline-block;
}

.credits {
    margin: 0;
}
</style>
