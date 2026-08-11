<template>
    <UFormField description="Password" help="Leave blank to generate a password automatically">
        <PasswordInput v-model:model-value="password" class="w-full" />
    </UFormField>
</template>
<script setup lang="ts">
import PasswordInput from '../PasswordInput.vue';

const password = defineModel<string | undefined>('password', {
    required: true
})
</script>