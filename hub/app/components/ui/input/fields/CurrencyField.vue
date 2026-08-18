<template>
    <UFormField label="Currency">
        <USelect disabled v-model="currency" :items="[...CURRENCIES]" default-value="VND" class="w-40" />
    </UFormField>
</template>
<script setup lang="ts">
import { CURRENCIES, type Currency } from '@rey-one/shared';

const currency = defineModel<Currency | undefined>('currency', {
    required: true
})
</script>