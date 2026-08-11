<template>
    <UFormField label="Name">
        <UInput v-model="name" class="w-full" placeholder="e.g. John Doe" />
    </UFormField>
</template>
<script setup lang="ts">

const name = defineModel<string | undefined>('name', {
    required: true
})
</script>