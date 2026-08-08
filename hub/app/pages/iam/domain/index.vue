<template>
    <div class="md:grid grid-cols-2 gap-5">
        <UCard>
            <template #title>
                <div class="flex justify-between items-center h-6">
                    Domain
                    <RefreshButton :loading="pending" @click="refresh" />
                </div>
            </template>
            <form class="space-y-5">
                <UFormField label="ID">
                    <UInput disabled :model-value="domain?.id" class="w-full" />
                </UFormField>
                <UFormField label="Name">
                    <UInput :model-value="domain?.name" class="w-full" />
                </UFormField>
                <UFormField label="Active">
                    <USwitch :model-value="domain?.active" :default-value="true" />
                </UFormField>
                <UFormField label="Permissions">
                    <UTable :data="permissions" sticky class="max-h-[50vh]">
                        <template #active-cell="{ row }">
                            <UCheckbox disabled :model-value="row.original.active" />
                        </template>
                    </UTable>
                </UFormField>
            </form>
        </UCard>
        <UCard>
            <template #title>
                <div class="flex justify-between items-center h-6">
                    Roles
                    <RoleForm v-model:role="selectedRole" :domain-name="data?.data.name"
                        :permissions="domain?.permissions ?? []" :leave-action="() => refresh()" action="create">
                        <template #icon>
                            <CreateButton size="sm" />
                        </template>
                    </RoleForm>
                </div>
            </template>
            <UTable :columns="roleColumns" :data="data?.data.roles" :sorting="rolesSorting">
                <template #no-cell="{ row }">{{ row.index + 1 }}</template>
                <template #active-cell="{ row }">
                    <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
                </template>
                <template #actions-cell="{ row }">
                    <RoleForm v-model:role="row.original" :domain-name="data?.data.name"
                        :permissions="domain?.permissions ?? []" :leave-action="() => refresh()" action="update">
                    </RoleForm>
                </template>
            </UTable>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { ApiResponse, DomainRoleView, DomainWithRolesView } from '@rey-one/shared';
import RoleForm from '~/components/domain/RoleForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import useDomain from '~/composables/domain';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import { useAPI } from '~/composables/api';
import type { TableColumn, TableRow } from '@nuxt/ui';

definePageMeta({
    middleware: ['domain']
})

type Response = ApiResponse<DomainWithRolesView>

const roleColumns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'active', header: "Status" },
    { id: 'actions' }
] satisfies TableColumn<DomainRoleView>[]

const { accessDomainId } = useDomain()

const { data, refresh, pending } = await useAsyncData(`domain:${accessDomainId.value}`, () => {
    if (!accessDomainId) {
        throw createError({
            status: 400,
            statusText: "API ERROR",
            message: "Domain required"
        })
    }
    return useAPI<Response>(`/domains/${accessDomainId.value}`)
})

const domain = computed(() => data.value?.data)
const selectedRole = ref<Partial<DomainRoleView>>()
const rolesSorting = ref([
    {
        id: 'name',
        desc: false
    }
])

const permissions = permissionsToChecks(domain.value?.permissions ?? [], true)
</script>