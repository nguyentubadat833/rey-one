<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { UserSummaryView } from '@rey-one/shared';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import Pagination from '~/components/ui/Pagination.vue';
import UserForm from '~/components/user/UserForm.vue';
import { createPaginationQuery } from '~/composables/api/pagination-query';
import useUser from '~/composables/user';

definePageMeta({
    title: "Users Management",
    middleware: ['admin']
});

const columns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'type', header: "Type" },
    { accessorKey: 'status', header: "Status" },
    { accessorKey: 'username', header: "Username" },
    { accessorKey: 'phone', header: "Phone" },
    { accessorKey: "email", header: "Email" },
    { id: 'actions' }
] satisfies TableColumn<UserSummaryView>[]

const { resetForm: resetUserForm, loadFormData: loadUserData } = useUser()

const paginationQuery = createPaginationQuery<UserSummaryView>('/users')
const { searchInput, TableGlobalSearch } = createTableGlobalFilter()

const { fetch, data } = paginationQuery
const { pending, refresh } = await fetch()

const rowSelection = ref<Record<string, boolean>>({})

function onSelect(e: Event, row: TableRow<UserSummaryView>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }
}

async function handlerClickUserButton(row: TableRow<UserSummaryView>) {
    await loadUserData(row.original.id)
    await nextTick()
}

function handlerClickAddUserButton() {
    resetUserForm()
}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <TableGlobalSearch/>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <UserForm :click-icon="handlerClickAddUserButton">
                    <template #icon>
                        <CreateButton />
                    </template>
                </UserForm>
            </div>
        </div>

        <UTable ref="usersTable" :columns="columns" v-model:row-selection="rowSelection" :data="data"
            v-model:global-filter="searchInput" :loading="pending" loading-color="primary" loading-animation="carousel"
            sticky class="flex-1 overflow-auto" @select="onSelect">
            <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            <template #actions-cell="{ row }">
                <UserForm :click-icon="() => handlerClickUserButton(row)" />
            </template>
        </UTable>

        <Pagination v-model:data="paginationQuery" />
    </div>
</template>
