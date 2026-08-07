<script setup lang="ts">
import { useAsyncAPI } from '~/composables/api';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { ApiResponse, DomainSummariesView, DomainSummaryView, PaginationQuery } from '@rey-one/shared';
import useDomain from '~/composables/domain';
import DomainForm from '~/components/domain/DomainForm.vue';
import CreateButton from '~/components/ui/button/CreateButton.vue';

definePageMeta({
    title: "Domains Management",
    middleware: ['admin']
});

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

const { domainFormState: domainState, resetForm: resetDomainFormState } = useDomain()
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

async function handlerClickDomainButton(row: TableRow<DomainSummaryView>) {
    Object.assign(domainFormData.value, row.original)
    await nextTick()
}

function handlerClickAddDomainButton() {
    resetDomainFormState()
}
</script>

<template>
    <div>
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-accented">
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div class="flex items-center gap-4">
                <RefreshButton @click="refresh" :loading="pending" />
                <DomainForm :click-icon="handlerClickAddDomainButton">
                    <template #icon>
                        <CreateButton />
                    </template>
                </DomainForm>
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
                <DomainForm :click-icon="() => handlerClickDomainButton(row)" />
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
