<template>
    <UButton icon="ic:baseline-close" color="neutral" variant="outline" :label="!labelHidden ? 'Cancel' : undefined" />
</template>

<script setup lang="ts">
defineProps<{
    labelHidden?: boolean
}>()
</script>