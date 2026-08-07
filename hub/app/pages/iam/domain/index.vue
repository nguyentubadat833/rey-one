<template>
    <div class="md:grid grid-cols-2 gap-5">
        <UCard title="Domain information">
            <form class="space-y-5" @submit.prevent="save">
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
        <UCard title="Domain roles">
            <UTable :columns="roleColumns" />
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { ApiResponse, DomainRoleView, DomainWithRolesView } from '@rey-one/shared';
import { useAPI } from '~/composables/api';
import useDomain from '~/composables/domain';

definePageMeta({
    middleware: ['domain']
})

const roleColumns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'status', header: "Status" },
    { id: 'actions' }
]

const { accessDomainState } = useDomain()

const { data, refresh, pending } = await useAsyncData(`${accessDomainState.domain?.domainId}_roles`, () => {
    if (!accessDomainState.domain) {
        throw createError({
            status: 400,
            statusText: "API ERROR",
            message: "Domain required"
        })
    }
    return useAPI<ApiResponse<DomainWithRolesView>>(`/domains/${accessDomainState.domain.domainId}`)
})

const domain = computed(() => data.value?.data)

const permissions = ref(
    domain.value?.permissions.map((name) => ({
        permission: name,
        active: true,
    }))
)

const form = reactive({
    data: null as DomainRoleView | null,
    loading: false
})

function save() {

}
</script>