<script setup lang="ts">
import { useAsyncAPI } from '~/composables/api';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { ApiResponse, DomainSummariesView, DomainSummaryView } from '@rey-one/shared';
import DomainForm from '~/components/DomainForm.vue';
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import useDomain from '~/composables/domain';
import CreateButton from '~/components/ui/button/CreateButton.vue';

definePageMeta({
    title: "Domains Management",
    middleware: ['admin']
});

const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'active', header: "Status" },
    // { accessorKey: "permissions", header: "Permissions" },
    { id: 'actions' }
] satisfies TableColumn<DomainSummaryView>[]

const { domainFormState, domainFormStateVersion, resetForm: resetDomainFormState } = useDomain()

const { data: response, pending, refresh } = await useAsyncAPI<ApiResponse<DomainSummariesView>>('/domains', {
    watch: [
        domainFormStateVersion
    ]
})
const domains = computed(() => response.value?.data.data ?? [])

const globalFilter = ref()
const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})
const rowSelection = ref<Record<string, boolean>>({})
const domainsTable = useTemplateRef('domainsTable')

function onSelect(e: Event, row: TableRow<DomainSummaryView>) {
    rowSelection.value = {
        [`${row.index}`]: true
    }

    Object.assign(domainFormState, row.original)
}

async function handlerClickDomainButton(row: TableRow<DomainSummaryView>) {
    Object.assign(domainFormState, row.original)
    await nextTick()
}

function handlerClickAddDomainButton() {
    resetDomainFormState()
}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-accented">
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <DomainForm @click="handlerClickAddDomainButton">
                    <template #icon>
                        <CreateButton />
                    </template>
                </DomainForm>
            </div>
        </div>
        <UTable ref="domainsTable" v-model:row-selection="rowSelection" v-model:pagination="pagination" :data="domains"
            :columns="columns" v-model:global-filter="globalFilter" :loading="pending" loading-color="primary"
            loading-animation="carousel" sticky class="flex-1 overflow-auto" @select="onSelect">
            <template #active-cell="{ row }">
                <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
            </template>
            <template #actions-cell="{ row }">
                <DomainForm @click="handlerClickDomainButton(row)" />
            </template>
        </UTable>
        <div class="flex justify-end border-t border-default pt-4 px-4">
            <UPagination :page="(domainsTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="domainsTable?.tableApi?.getState().pagination.pageSize"
                :total="domainsTable?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => domainsTable?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>
</template>
