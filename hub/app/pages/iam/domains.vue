<script setup lang="ts">
import { createPaginationQuery } from '~/composables/api/pagination-query';
import DomainForm from '~/components/domain/DomainForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import useDomainForm from '~/components/domain/composables/useDomainForm';
import Pagination from '~/components/ui/Pagination.vue';
import { DOMAIN_PERMISSIONS, type DomainSummarySchema } from '@rey-one/shared';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type z from 'zod';

type DomainSummary = z.infer<typeof DomainSummarySchema>

definePageMeta({
    title: "Domains Management",
    middleware: ['system-user']
});

const Modal = resolveComponent('UModal')

const columns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'status', header: "Status" },
    { accessorKey: 'plan', header: "Plan" },
    { accessorKey: 'startedAt', header: "Started at" },
    { accessorKey: 'expiresAt', header: "Expires at" },
    { accessorKey: "owner", header: "Owner" },
    { id: 'actions' }
] satisfies TableColumn<DomainSummary>[]

const { domainFormState: domainState, resetForm: resetDomainFormState, loadDomain, save } = useDomainForm()
const { createPermissionsChecks } = permission()
const domainFormData = toRef(domainState, 'data')

const paginationQuery = createPaginationQuery<DomainSummary>('/domains', 5)
const { searchInput, TableGlobalSearch } = createTableGlobalFilter()

const { fetch, data } = paginationQuery
const { pending, refresh } = await fetch()

const rowSelection = ref<Record<string, boolean>>({})

function onSelect(e: Event, row: TableRow<DomainSummary>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }

    Object.assign(domainFormData.value, row.original)
}

function DomainButton(type: 'edit' | 'add', rowData?: DomainSummary) {
    const isAdd = type === 'add'

    return h(Modal,
        {
            title: isAdd ? '*New Domain' : domainFormData.value.name
        },
        {
            default: () => h(isAdd ? CreateButton : EditButton,
                {
                    onClick: async () => {
                        if (isAdd) {
                            resetDomainFormState()
                            domainState.permissionChecks = createPermissionsChecks({
                                referencePermissions: [...DOMAIN_PERMISSIONS]
                            })
                        } else {
                            await loadDomain(rowData!.id)
                            domainState.permissionChecks = createPermissionsChecks({
                                referencePermissions: [...DOMAIN_PERMISSIONS],
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
const UpdateDomainButton = (row: DomainSummary) => DomainButton('edit', row)

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
        <UTable v-model:row-selection="rowSelection" :data="data" :columns="columns" v-model:global-filter="searchInput"
            :loading="pending" loading-color="primary" loading-animation="carousel" sticky class="h-[70vh]"
            @select="onSelect">
            <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            <template #startedAt-cell="{ row }">
                <NuxtTime :datetime="row.original.startedAt" dateStyle="medium" locale="vi-VN" />
            </template>
            <template #expiresAt-cell="{ row }">
                <NuxtTime v-if="row.original.expiresAt" :datetime="row.original.expiresAt" dateStyle="medium" locale="vi-VN" />
            </template>
            <template #owner-cell="{row}">
                {{ row.original.owner.email }}
            </template>
            <template #actions-cell="{ row }">
                <component :is="UpdateDomainButton(row.original)" />
            </template>
        </UTable>
        <Pagination :data="paginationQuery" />
    </div>
</template>
