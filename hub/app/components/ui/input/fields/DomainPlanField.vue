<template>
    <UFormField label="Plan">
        <USelect v-model="status" :items="[...SUBSCRIPTION_PLANS]" default-value="monthly" class="w-40" />
    </UFormField>
</template>
<script setup lang="ts">
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@rey-one/shared';

const status = defineModel<SubscriptionPlan | undefined>('plan', {
    required: true
})
</script>