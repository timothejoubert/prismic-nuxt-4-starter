<script lang="ts" setup>
import { usePrismicFetchDocument } from '#imports'

const { data } = await usePrismicFetchDocument('menu')
const links = computed(() => data.value.data?.links)
</script>

<template>
	<nav :aria-label="$t('main_nav')">
		<ul v-if="links?.length">
			<li
				v-for="link in links"
				:key="link.url"
			>
				<slot
					:url="link.url"
					:label="link.text || link.label || link.url"
				>
					<VPrismicLink
						:to="link"
						:label="link.text || link.label || link.url"
					/>
				</slot>
			</li>
		</ul>
	</nav>
</template>

<!-- <style lang="scss" module></style> -->
