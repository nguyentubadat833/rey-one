<template>
  <UFormField label="Payment type">
    <USelect :disabled="isDisabled" v-model="type" :items="[...ORDER_PAYMENT_TYPES]" default-value='one_time'
      class="w-40" />
  </UFormField>
</template>
<script setup lang="ts">
import { ORDER_PAYMENT_TYPES, type OrderPaymentType } from "@rey-one/shared";

const type = defineModel<OrderPaymentType | undefined>("type", {
  required: true,
});

withDefaults(
  defineProps<{
    isDisabled?: boolean;
  }>(),
  {
    isDisabled: true
  }
)
</script>
