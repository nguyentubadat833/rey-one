<template>
    <form class="space-y-5">
        <CopyableField :model-value="domainFormState.data.id"/>
        <NameField v-model:name="domainFormState.data.name"/>
        <DomainStatusField v-model:status="domainFormState.data.status"/>
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
import CopyableField from '../ui/input/fields/CopyableField.vue';
import DomainStatusField from '../ui/input/fields/DomainStatusField.vue';
import NameField from '../ui/input/fields/NameField.vue';
import useDomainForm from './composables/useDomainForm'

const { domainFormState } = useDomainForm()
</script>