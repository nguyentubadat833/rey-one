<template>
    <UButton icon="ic:round-playlist-add" :label="!labelHidden ? 'Add' : undefined" />
</template>
<script setup lang="ts">
defineProps<{
    labelHidden?: boolean
}>()
</script>