<template>
    <UFormField :label="label ?? 'Active'">
        <USwitch :disabled="isDisabled" v-model="active" :default-value="defaultValue ?? true" />
    </UFormField>
</template>
<script setup lang="ts">

const active = defineModel<boolean | undefined>('active', {
    required: true
})

defineProps<{
    label?: string
    isDisabled?: boolean
    defaultValue?: boolean
}>()
</script>