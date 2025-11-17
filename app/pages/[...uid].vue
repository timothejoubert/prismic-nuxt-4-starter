<script lang="ts" setup>
import type { AboutPageDocument, ArchivePageDocument, HomePageDocument, ProjectListingPageDocument, ProjectPageDocument } from '~~/prismicio-types'
import { components } from '~/components/slices/index'

const { document } = await useFetchPage(undefined)

const homeDocument = computed(() => document.value.type === 'home_page' ? document.value as HomePageDocument : undefined)
const aboutDocument = computed(() => document.value.type === 'about_page' ? document.value as AboutPageDocument : undefined)
const archiveDocument = computed(() => document.value.type === 'archive_page' ? document.value as ArchivePageDocument : undefined)
const projectListingDocument = computed(() => document.value.type === 'project_listing_page' ? document.value as ProjectListingPageDocument : undefined)
const projectDocument = computed(() => document.value.type === 'project_page' ? document.value as ProjectPageDocument : undefined)
</script>

<template>
	<div>
		<LazyVHomePage
			v-if="homeDocument"
			:document="homeDocument"
		/>
		<LazyVProjectPage
			v-else-if="projectDocument"
			:document="projectDocument"
		/>
		<LazyVProjectListingPage
			v-else-if="projectListingDocument"
			:document="projectListingDocument"
		/>
		<LazyVArchivePage
			v-else-if="archiveDocument"
			:document="archiveDocument"
		/>
		<LazyVAboutPage
			v-else-if="aboutDocument"
			:document="aboutDocument"
		/>
		<div v-else>
			<h1>Fallback page</h1>
		</div>
		<LazySliceZone
			v-if="document.data.slices?.length"
			:slices="document.data.slices"
			:components="components"
		/>
	</div>
</template>
