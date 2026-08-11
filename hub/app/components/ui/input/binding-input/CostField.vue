<template>
  <UFormField label="Default cost">
    <UInputNumber
      v-model="cost"
      :increment="false"
      :decrement="false"
      :format-options="{
        style: 'currency',
        currency: 'VND',
        currencyDisplay: 'code',
        currencySign: 'accounting',
      }"
      class="w-full"
      :placeholder="placeholder"
    />
  </UFormField>
</template>
<script setup lang="ts">
const cost = defineModel<number | undefined>("cost", {
  required: true,
});

withDefaults(
  defineProps<{
    placeholder?: string;
  }>(),
  {
    placeholder: "e.g. 100,000",
  },
);
</script>
