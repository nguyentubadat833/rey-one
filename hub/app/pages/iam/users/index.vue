<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { ApiResponse, UserSummariesView, UserSummaryView } from '@rey-one/shared';
import { useAsyncAPI } from '~/composables/api';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import UserForm from '~/components/UserForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
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

const { userFormState } = useUser()

const { data: response, pending, refresh } = await useAsyncAPI<ApiResponse<UserSummariesView>>('/users')
const users = computed(() => response.value?.data.data ?? [])

const globalFilter = ref()
const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})
const rowSelection = ref<Record<string, boolean>>({})
const usersTable = useTemplateRef('usersTable')

function onSelect(e: Event, row: TableRow<UserSummaryView>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }
}

async function handlerClickUserButton(row: TableRow<UserSummaryView>) {

    await nextTick()
}

function handlerClickAddUserButton() {

}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <UserForm :click-icon="handlerClickAddUserButton">
                    <template #icon>
                        <CreateButton />
                    </template>
                </UserForm>
            </div>
        </div>

        <UTable ref="usersTable" :columns="columns" v-model:row-selection="rowSelection" v-model:pagination="pagination"
            :data="users" v-model:global-filter="globalFilter" :loading="pending" loading-color="primary"
            loading-animation="carousel" sticky class="flex-1 overflow-auto" @select="onSelect">
            <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            <template #actions-cell="{ row }">
                <UserForm :click-icon="() => handlerClickUserButton(row)" />
            </template>
        </UTable>

        <div class="flex justify-end border-t border-default pt-4 px-4">
            <UPagination :page="(usersTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="usersTable?.tableApi?.getState().pagination.pageSize"
                :total="usersTable?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => usersTable?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>
</template>
