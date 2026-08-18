<template>
    <UFormField label="Status">
        <USelect v-model="status" :items="[...PRODUCT_STATUSES]" default-value="active" class="w-40" />
    </UFormField>
</template>
<script setup lang="ts">
import { PRODUCT_STATUSES, type ProductStatus } from '@rey-one/shared';

const status = defineModel<ProductStatus | undefined>('status', {
    required: true
})
</script>