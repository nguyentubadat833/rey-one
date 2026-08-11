<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { UserSummaryView } from '@rey-one/shared';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';
import Pagination from '~/components/ui/Pagination.vue';
import useUserForm from '~/components/user/composables/useUserForm';
import UserForm from '~/components/user/UserForm.vue';
import { createPaginationQuery } from '~/composables/api/pagination-query';

definePageMeta({
    title: "Users Management",
    middleware: ['admin']
});

const Modal = resolveComponent('UModal')

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

const { resetForm: resetUserForm, loadFormData: loadUserData, userFormState, save } = useUserForm()

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

function UserButton(user?: UserSummaryView) {
    const isAdd = !user

    return h(Modal,
        {},
        {
            default: () => h(isAdd ? CreateButton : EditButton,
                {
                    onClick: async () => {
                        resetUserForm()
                        if (!isAdd) {
                            await loadUserData(user?.id)
                        }
                    }
                }
            ),
            body: () => h(UserForm),
            footer: () => h('div',
                { class: 'flex justify-end gap-3 w-full' },
                [
                    h(SaveButton, {
                        loading: userFormState.loading,
                        onClick: () => save()
                    })
                ]
            )
        }
    )
}

</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <TableGlobalSearch />
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <component :is="UserButton()" />
            </div>
        </div>

        <UTable ref="usersTable" :columns="columns" v-model:row-selection="rowSelection" :data="data"
            v-model:global-filter="searchInput" :loading="pending" loading-color="primary" loading-animation="carousel"
            sticky class="flex-1 overflow-auto" @select="onSelect">
            <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            <template #actions-cell="{ row }">
                <component :is="() => UserButton(row.original)" />
            </template>
        </UTable>

        <Pagination v-model:data="paginationQuery" />
    </div>
</template>
