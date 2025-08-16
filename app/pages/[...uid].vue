<script lang="ts" setup>

const route = useRoute()
const uid = route.params.uid

</script>
<template>
    <div :class="$style.root">
        <h1>Page: {{ uid }}</h1>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
