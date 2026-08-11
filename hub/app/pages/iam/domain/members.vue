<template>
    <div class="space-y-5">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <TableGlobalSearch />
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <!-- <UserForm :click-icon="handlerClickAddUserButton">
                    <template #icon>
                        <CreateButton />
                    </template>
</UserForm> -->
            </div>
        </div>

        <UTable :data="members" :columns="memberColumns" v-model:global-filter="searchInput" :loading="pending"
            loading-color="primary" loading-animation="carousel">
            <template #role-cell="{ row }">
                <RoleForm v-if="row.original.role" v-model:role="row.original.role">
                    <template #icon>
                        <UButton icon="ic:baseline-more-horiz" variant="outline" color="neutral" />
                    </template>
                </RoleForm>
            </template>
        </UTable>

        <Pagination :data="paginationQuery" />
    </div>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { DomainMemberView } from '@rey-one/shared';
import { createPaginationQuery } from '~/composables/api/pagination-query';
import RoleForm from '~/components/domain/RoleForm.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import Pagination from '~/components/ui/Pagination.vue';

definePageMeta({
    title: "Members Management",
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

const paginationQuery = createPaginationQuery<DomainMemberView>('/domain-members', 5)
const { searchInput, TableGlobalSearch } = createTableGlobalFilter()
const { fetch, data: members } = paginationQuery

const { refresh, pending } = await fetch()
</script>