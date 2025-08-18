<script lang="ts" setup>
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <VNav :class="$style.nav" />
        <NuxtPage />
    </div>
</template>

<style lang="scss" module>
.nav {
    position: fixed;
    bottom: 24px;
    left: 50%;
    translate: -50%;
    z-index: 101;
}
</style>
