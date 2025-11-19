<script lang="ts" setup>
import { MAIN_MENU_TYPE } from '~~/shared/prismic-documents'

const { data } = await usePrismicFetchDocument(MAIN_MENU_TYPE)

const links = computed(() => data.value.data?.links || [])
</script>

<template>
	<header :class="$style.root">
		<nav :aria-label="$t('main_nav')">
			<ul v-if="links?.length" :class="$style.list">
				<li
					v-for="link in links"
					:key="link.to"
					:class="$style.item"
					>
					<PrismicLink :field="link" />
				</li>
			</ul>
		</nav>
	</header>
</template>

<style lang="scss" module>
.root {
	position: relative;
}

.list {
	display: flex;
	justify-content: center;
	padding: initial;
	gap: 14px;
}

.item {
	list-style: none;
}
</style>
