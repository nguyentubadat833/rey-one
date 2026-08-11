<template>
    <UFormField description="Email">
        <UInput v-model="email" class="w-full" placeholder="e.g. john@example.com"
            trailing-icon="ic:baseline-alternate-email" />
    </UFormField>
</template>
<script setup lang="ts">

const email = defineModel<string | undefined>('email', {
    required: true
})
</script>