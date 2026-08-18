<template>
    <UFormField label="Status">
        <USelect v-model="status" :items="[...USER_STATUSES]" default-value="active" class="w-40" />
    </UFormField>
</template>
<script setup lang="ts">
import { USER_STATUSES, type UserStatus } from '@rey-one/shared';

const status = defineModel<UserStatus | undefined>('status', {
    required: true
})
</script>