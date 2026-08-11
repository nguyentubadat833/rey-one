<template>
  <UFormField label="Type">
    <USelect :disabled="isDisabled" v-model="type" :items="[...PRODUCT_TYPES]" class="w-40" />
  </UFormField>
</template>
<script setup lang="ts">
import { PRODUCT_TYPES, type ProductType } from "@rey-one/shared";

const type = defineModel<ProductType | undefined>("type", {
  required: true,
});

defineProps<{
  isDisabled?: boolean;
}>();
</script>
