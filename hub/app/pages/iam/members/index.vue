<template>
    <div class="space-y-5">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <!-- <UserForm :click-icon="handlerClickAddUserButton">
                    <template #icon>
                        <CreateButton />
                    </template>
</UserForm> -->
            </div>
        </div>

        <UTable v-model:pagination="pagination" :data="members?.data ?? []" :columns="memberColumns" />

        <div class="flex justify-end border-t border-default pt-4 px-4">
            <UPagination :page="(membersTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="membersTable?.tableApi?.getState().pagination.pageSize"
                :total="membersTable?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => membersTable?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { ApiResponse, DomainMemberView, DomainRoleView } from '@rey-one/shared';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import { useAPI } from '~/composables/api';
import useDomain from '~/composables/domain';

definePageMeta({
    middleware: ['domain']
})

const memberColumns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'status', header: "Status" },
    { accessorKey: 'email', header: "Email" },
    { accessorKey: 'username', header: "Username" },
    { accessorKey: 'phone', header: "Phone" },
    { accessorKey: 'role', header: "Role" },
    { id: 'actions' }
] satisfies TableColumn<DomainMemberView>[]

const { accessDomainId } = useDomain()

const { data: members, refresh, pending } = await useAsyncData(`domain_members:${accessDomainId.value}`, () => useAPI<ApiResponse<DomainMemberView[]>>('/domain-members'))
const { data: roles } = await useLazyAsyncData(`domain_roles:${accessDomainId.value}`, () => useAPI<ApiResponse<DomainRoleView>>('/domain-roles'))

const membersTable = useTemplateRef('membersTable')
const globalFilter = ref()
const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})
</script>