<script lang="ts" setup>
import { MAIN_MENU_TYPE } from '~~/shared/prismic-documents'

const { data } = await usePrismicFetchDocument(MAIN_MENU_TYPE)

const links = computed(() => data.value.data?.links || [])
</script>

<template>
	<nav :aria-label="$t('main_nav')">
		<ul v-if="links?.length">
			<li
				v-for="link in links"
				:key="link.to"
			>
				<PrismicLink :field="link" />
			</li>
		</ul>
	</nav>
</template>

<!-- <style lang="scss" module></style> -->
