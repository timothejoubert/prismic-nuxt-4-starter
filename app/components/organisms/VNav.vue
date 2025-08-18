<script lang="ts" setup>
const links = [
    { label: 'Home', url: '/' },
    { label: 'Test', url: '/path' },
]
</script>

<template>
    <nav :aria-label="$t('main_nav')">
        <ul>
            <li
                v-for="link in links"
                :key="link.url"
            >
                <slot
                    :url="link.url"
                    :label="link.label"
                >
                    <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
                </slot>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
</style>
