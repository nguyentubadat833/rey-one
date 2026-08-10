<template>
    <form class="space-y-5">
        <UFormField label="ID">
            <UInput disabled v-model="data.id" class="w-full" placeholder="Leave blank to generate automatically" />
        </UFormField>
        <UFormField label="Name">
            <UInput v-model="data.name" class="w-full" placeholder="Display name for this role" />
        </UFormField>
        <UFormField label="Active">
            <USwitch v-model="data.active" :default-value="true" />
        </UFormField>
        <UFormField label="Permissions">
            <UTable :data="permissionChecks" sticky class="max-h-[50vh]">
                <template #active-cell="{ row }">
                    <UCheckbox v-model="row.original.active" />
                </template>
            </UTable>
        </UFormField>
    </form>
</template>

<script setup lang="ts">
import type { AppPermission } from '@rey-one/shared';
import useRoleForm from './composables/useRoleForm';

const props = defineProps<{
    referencePermissions?: AppPermission[]
}>()

const { createPermissionsChecks } = useDomainUtils()
const { roleFormState } = useRoleForm()
const data = toRef(roleFormState, 'data')
const permissionChecks = toRef(roleFormState, 'permissionChecks')

onMounted(() => {
    permissionChecks.value = createPermissionsChecks({
        referencePermissions: props.referencePermissions,
        currentPermissions: data.value.permissions
    })
})

</script>