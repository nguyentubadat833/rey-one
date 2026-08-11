<template>
    <UFormField :label="label ?? 'Text'">
        <UTextarea v-model="text" class="w-full" placeholder="Enter any content ..." />
    </UFormField>
</template>
<script setup lang="ts">

const text = defineModel<string | undefined>('text', {
    required: true
})

defineProps<{
    label?: string
}>()
</script>