<template>
    <div class="space-y-5">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <TableGlobalSearch />
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <component :is="MemberButton()" v-model:open="open" />
            </div>
        </div>

        <UTable :data="members" :columns="memberColumns" v-model:global-filter="searchInput" :loading="pending"
            loading-color="primary" loading-animation="carousel">
            <template #no-cell="{ row }">
                {{ row.index + 1 }}
            </template>
            <template #role-cell="{ row }">
                {{ row.original.role?.name }}
            </template>
            <template #actions-cell="{ row }">
                <component :is="MemberButton(row.original)" />
            </template>
        </UTable>

        <Pagination :data="paginationQuery" />
    </div>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { DomainMemberView } from '@rey-one/shared';
import { createPaginationQuery } from '~/composables/api/pagination-query';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import Pagination from '~/components/ui/Pagination.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';
import useMemberForm from '~/components/domain/composables/useMemberForm';
import MemberForm from '~/components/domain/MemberForm.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';

definePageMeta({
    title: "Members Management",
    middleware: ['domain']
})

defineShortcuts({
    escape: {
        handler: () => {
            open.value = false
        }
    },
    enter: {
        handler: () => submit()
    }
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
const { resetFormData, memberFormState, save, loadMember } = useMemberForm()
const { fetch, data: members } = paginationQuery

const { refresh, pending } = await fetch()
const open = ref(false)

const Modal = resolveComponent('UModal')

const submit = () => save().then(() => {
    refresh()
})

const MemberButton = (row?: DomainMemberView) => {
    const isAdd = !row
    return h(Modal,
        {
            title: isAdd ? '*New member' : row.name
        },
        {
            default: () => h(isAdd ? CreateButton : EditButton,
                {
                    onClick: async () => {
                        resetFormData()
                        if (row) {
                            await loadMember(row.id)
                        }
                    }
                }
            ),
            body: () => h(MemberForm),
            footer: () => h('div',
                { class: 'flex justify-end gap-3 w-full' },
                [
                    h(SaveButton, {
                        loading: memberFormState.loading,
                        onClick: submit
                    })
                ]
            )
        }
    )
}
</script>