<script setup lang="ts">
import { useAsyncAPI } from '~/composables/api';
import { APP_PERMISSIONS, type ApiResponse, type DomainSummariesView, type DomainSummaryView, type PaginationQuery } from '@rey-one/shared';
import useDomain from '~/composables/domain';
import DomainForm from '~/components/domain/DomainForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';
import EditButton from '~/components/ui/button/EditButton.vue';
import SaveButton from '~/components/ui/button/SaveButton.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
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

const { domainFormState: domainState, resetForm: resetDomainFormState, createPermissionsChecks, save } = useDomain()
const domainFormData = toRef(domainState, 'data')
const domainFormStateVersion = toRef(domainState, 'version')

const globalFilter = ref()
const paginationQuery = ref<PaginationQuery>({
    page: 1,
    limit: 30
})
const rowSelection = ref<Record<string, boolean>>({})

const { data: response, pending, refresh } = await useAsyncAPI<ApiResponse<DomainSummariesView>>('/domains', {
    query: paginationQuery,
    watch: [
        domainFormStateVersion,
        paginationQuery.value
    ]
})
const domains = computed(() => response.value?.data.data ?? [])
const totalRows = computed(() => response.value?.data.total)

function onSelect(e: Event, row: TableRow<DomainSummaryView>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }

    Object.assign(domainFormData.value, row.original)
}

function DomainButton(type: 'edit' | 'add', rowData?: DomainSummaryView) {
    const isAdd = type === 'add'

    domainState.permissionChecks = createPermissionsChecks([...APP_PERMISSIONS])
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
                        } else {
                            Object.assign(domainFormData.value, rowData)
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
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <AddDomainButton />
            </div>
        </div>
        <UTable v-model:row-selection="rowSelection" :data="domains" :columns="columns"
            v-model:global-filter="globalFilter" :loading="pending" loading-color="primary" loading-animation="carousel"
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
        <div class="flex justify-end border-t border-default pt-4 px-4">
            <UPagination :page="paginationQuery.page" :items-per-page="paginationQuery.limit" :total="totalRows"
                @update:page="(p) => {
                    paginationQuery.page = p
                }" />
        </div>
    </div>
</template>
