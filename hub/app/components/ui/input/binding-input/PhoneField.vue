<template>
    <UFormField description="Phone">
        <UInput v-model="phone" class="w-full" placeholder="e.g. 0912345678"
            trailing-icon="ic:outline-contact-phone" />
    </UFormField>
</template>
<script setup lang="ts">

const phone = defineModel<string | undefined>('phone', {
    required: true
})
</script>