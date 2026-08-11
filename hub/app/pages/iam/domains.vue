<script setup lang="ts">
import { APP_PERMISSIONS, type DomainSummaryView } from '@rey-one/shared';
import { createPaginationQuery } from '~/composables/api/pagination-query';
import DomainForm from '~/components/domain/DomainForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import useDomainForm from '~/components/domain/composables/useDomainForm';
import Pagination from '~/components/ui/Pagination.vue';
import type { TableColumn, TableRow } from '@nuxt/ui';

definePageMeta({
    title: "Domains Management",
    middleware: ['admin']
});

const Modal = resolveComponent('UModal')

const columns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'active', header: "Status" },
    { accessorKey: 'memberCount', header: "Members" },
    { accessorKey: 'roleCount', header: "Roles" },
    { accessorKey: 'productCount', header: "Products" },
    { accessorKey: "registeredAt", header: "Registered At" },
    { id: 'actions' }
] satisfies TableColumn<DomainSummaryView>[]

const { domainFormState: domainState, resetForm: resetDomainFormState, save } = useDomainForm()
const { createPermissionsChecks } = useDomainUtils()
const domainFormData = toRef(domainState, 'data')

const paginationQuery = createPaginationQuery<DomainSummaryView>('/domains', 5)
const { searchInput, TableGlobalSearch } = createTableGlobalFilter()

const { fetch, data } = paginationQuery
const { pending, refresh } = await fetch()

const rowSelection = ref<Record<string, boolean>>({})

function onSelect(e: Event, row: TableRow<DomainSummaryView>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }

    Object.assign(domainFormData.value, row.original)
}

function DomainButton(type: 'edit' | 'add', rowData?: DomainSummaryView) {
    const isAdd = type === 'add'

    return h(Modal,
        {
            title: isAdd ? '*New Domain' : domainFormData.value.name
        },
        {
            default: () => h(isAdd ? CreateButton : EditButton,
                {
                    onClick: () => {
                        if (isAdd) {
                            resetDomainFormState()
                            domainState.permissionChecks = createPermissionsChecks({
                                referencePermissions: [...APP_PERMISSIONS]
                            })
                        } else {
                            Object.assign(domainFormData.value, rowData)
                            domainState.permissionChecks = createPermissionsChecks({
                                referencePermissions: [...APP_PERMISSIONS],
                                currentPermissions: domainFormData.value.permissions
                            })
                        }
                    }
                }
            ),
            body: () => h(DomainForm, {}),
            footer: () => h('div',
                { class: 'flex justify-end gap-3 w-full' },
                [
                    h(SaveButton, {
                        loading: domainState.loading,
                        onClick: () => save()
                    })
                ]
            )
        }
    )
}

const AddDomainButton = () => DomainButton('add')
const UpdateDomainButton = (row: DomainSummaryView) => DomainButton('edit', row)

</script>

<template>
    <div>
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-accented">
            <TableGlobalSearch />
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <AddDomainButton />
            </div>
        </div>
        <UTable v-model:row-selection="rowSelection" :data="data" :columns="columns"
            v-model:global-filter="searchInput" :loading="pending" loading-color="primary" loading-animation="carousel"
            sticky class="h-[70vh]" @select="onSelect">
            <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            <template #active-cell="{ row }">
                <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
            </template>
            <template #registeredAt-cell="{ row }">
                <NuxtTime :datetime="row.original.registeredAt" dateStyle="medium" locale="vi-VN" />
            </template>
            <template #actions-cell="{ row }">
                <component :is="UpdateDomainButton(row.original)" />
            </template>
        </UTable>
        <Pagination :data="paginationQuery" />
    </div>
</template>
