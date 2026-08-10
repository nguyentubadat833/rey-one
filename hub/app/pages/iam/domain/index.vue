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
                    <!-- <RoleForm v-model:role="selectedRole" :domain-name="data?.data.name"
                        :reference-permissions="permissions" :leave-action="() => refresh()" action="create">
                        <template #icon>
                            <CreateButton size="sm" />
                        </template>
    </RoleForm> -->
                </div>
            </template>
            <UTable :columns="roleColumns" :data="data?.data.roles">
                <template #no-cell="{ row }">{{ row.index + 1 }}</template>
                <template #active-cell="{ row }">
                    <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
                </template>
                <template #actions-cell="{ row }">
                    <!-- <RoleForm v-model:role="row.original" :domain-name="data?.data.name"
                        :reference-permissions="domain?.permissions ?? []" :leave-action="() => refresh()" action="update">
                    </RoleForm> -->
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { ApiResponse, DomainRoleView, DomainWithRolesView } from '@rey-one/shared';
import type { TableColumn } from '@nuxt/ui';
import { useAPI } from '~/composables/api';
import { useDomainForm } from '~/composables/domain';
import RoleForm from '~/components/domain/RoleForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import DomainForm from '~/components/domain/DomainForm.vue';

definePageMeta({
    middleware: ['domain']
})

type Response = ApiResponse<DomainWithRolesView>

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
const permissions = computed(() => data.value?.data.permissions ?? [])

const selectedRole = ref<Partial<DomainRoleView>>()

</script>