<template>
    <UFormField label="Status">
        <USelect v-model="status" :items="[...DOMAIN_STATUSES]" default-value="active" class="w-40" />
    </UFormField>
</template>
<script setup lang="ts">
import { DOMAIN_STATUSES, type DomainStatus} from '@rey-one/shared';


const status = defineModel<DomainStatus | undefined>('status', {
    required: true
})
</script>