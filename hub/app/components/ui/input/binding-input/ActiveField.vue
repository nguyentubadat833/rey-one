<template>
    <UFormField label="Active">
          <USwitch v-model="active" :default-value="true" />
    </UFormField>
</template>
<script setup lang="ts">

const active = defineModel<boolean | undefined>('active', {
    required: true
})
</script>