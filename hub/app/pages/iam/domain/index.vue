<template>
    <div class="md:grid grid-cols-2 gap-5">
        <UCard class="pointer-events-none">
            <template #title>
                <div class="flex justify-between items-center h-6">
                    Domain
                    <RefreshButton :loading="pending" @click="refresh" />
                </div>
            </template>
            <DomainForm />
        </UCard>
        <UCard>
            <template #title>
                <div class="flex justify-between items-center h-6">
                    Roles
                    <component :is="roleButtonRender().createButton()" />
                </div>
            </template>
            <UTable :columns="roleColumns" :data="data?.data.roles">
                <template #no-cell="{ row }">{{ row.index + 1 }}</template>
                <template #active-cell="{ row }">
                    <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
                </template>
                <template #actions-cell="{ row }">
                    <component :is="roleButtonRender().updateButton(row.original)" />
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { ApiResponse, DomainRoleView, DomainWithRolesView } from '@rey-one/shared';
import type { TableColumn } from '@nuxt/ui';
import { useAPI } from '~/composables/api';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import DomainForm from '~/components/domain/DomainForm.vue';
import useDomainForm from '~/components/domain/composables/useDomainForm';
import RoleForm from '~/components/domain/RoleForm.vue';
import useRoleForm from '~/components/domain/composables/useRoleForm';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';

definePageMeta({
    middleware: ['domain']
})

type Response = ApiResponse<DomainWithRolesView>

const Modal = resolveComponent('UModal')

const roleColumns = [
    {
        id: 'no'
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'active', header: "Status" },
    { id: 'actions' }
] satisfies TableColumn<DomainRoleView>[]

const { domainFormState } = useDomainForm()
const { createPermissionsChecks } = useDomainUtils()
const { accessDomainId } = useAccessDomains()
const { resetForm: resetRoleForm, roleFormState, save: saveRole } = useRoleForm()

const { data, refresh, pending } = await useAsyncData(`domain:${accessDomainId.value}`, () => {
    if (!accessDomainId) {
        throw createError({
            status: 400,
            statusText: "API ERROR",
            message: "Domain required"
        })
    }
    return useAPI<Response>(`/domains/${accessDomainId.value}`, {
        onResponse({ response }) {
            if (response.ok) {
                const result = response._data as Response

                Object.assign(domainFormState.data, result.data)
                domainFormState.permissionChecks = createPermissionsChecks({
                    currentPermissions: domainFormState.data.permissions
                })
            }
        }
    })
})

const referencePermissions = computed(() => data.value?.data.permissions ?? [])

const roleButtonRender = () => {
    const Form = h(RoleForm, { referencePermissions: referencePermissions.value })
    const ModalFooter = h('div',
        { class: 'flex justify-end gap-3 w-full' },
        [
            h(SaveButton, {
                loading: roleFormState.loading,
                onClick: () => saveRole()
            })
        ]
    )

    return {
        createButton: () => h(Modal,
            { title: "*New Role" },
            {
                default: () => h(CreateButton,
                    {
                        onClick: () => {
                            resetRoleForm()
                        }
                    }
                ),
                body: () => Form,
                footer: () => ModalFooter
            }
        ),
        updateButton: (rowData: DomainRoleView) => h(Modal,
            { title: roleFormState.data.name ?? "Update Role" },
            {
                default: () => h(EditButton,
                    {
                        onClick: () => {
                            Object.assign(roleFormState.data, rowData)
                        }
                    }
                ),
                body: () => Form,
                footer: () => ModalFooter
            }
        ),
    }
}
</script>