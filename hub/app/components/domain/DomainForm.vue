<template>
    <form class="space-y-5">
        <CopyableField :model-value="domainFormState.data.id"/>
        <NameField v-model:name="domainFormState.data.name"/>
        <ActiveField v-model:active="domainFormState.data.active"/>
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
import ActiveField from '../ui/input/fields/ActiveField.vue';
import CopyableField from '../ui/input/fields/CopyableField.vue';
import NameField from '../ui/input/fields/NameField.vue';
import useDomainForm from './composables/useDomainForm'

const { domainFormState } = useDomainForm()
</script>