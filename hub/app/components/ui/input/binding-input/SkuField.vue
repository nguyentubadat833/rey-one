<template>
  <UFormField label="SKU">
    <UInput
      :disabled="isDisabled"
      v-model="sku"
      class="w-full"
      placeholder="Enter SKU or leave blank to generate"
    />
  </UFormField>
</template>
<script setup lang="ts">
const sku = defineModel<string | undefined>("sku", {
  required: true,
});

defineProps<{
  isDisabled?: boolean;
}>();
</script>
