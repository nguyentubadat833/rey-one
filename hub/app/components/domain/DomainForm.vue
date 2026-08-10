<template>
    <form class="space-y-5">
        <UFormField label="ID">
            <UInput disabled v-model="domainFormState.data.id" class="w-full"
                placeholder="Leave blank to generate automatically" />
        </UFormField>
        <UFormField label="Name">
            <UInput v-model="domainFormState.data.name" class="w-full" placeholder="Display name for this domain" />
        </UFormField>
        <UFormField label="Active">
            <USwitch v-model="domainFormState.data.active" :default-value="true" />
        </UFormField>
        <UFormField label="Permissions">
            <UTable :data="domainFormState.permissionChecks" sticky class="max-h-[50vh]">
                <template #active-cell="{ row }">
                    <UCheckbox v-model="row.original.active" />
                </template>
            </UTable>
        </UFormField>
    </form>
</template>
<script setup lang="ts">
import useDomainForm from './composables/useDomainForm'

const { domainFormState } = useDomainForm()
</script>