<template>
    <UFormField description="Username">
        <UInput v-model="username" class="w-full" placeholder="e.g. john_doe"
            trailing-icon="ic:baseline-person-outline" />
    </UFormField>
</template>
<script setup lang="ts">

const username = defineModel<string | undefined>('username', {
    required: true
})
</script>