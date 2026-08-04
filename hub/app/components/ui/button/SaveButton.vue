<template>
    <UButton icon="ic:outline-done-all" :label="!labelHidden ? 'Save' : undefined" />
</template>
<script setup lang="ts">
defineProps<{
    labelHidden?: boolean
}>()
</script>