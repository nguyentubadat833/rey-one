<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { ApiResponse, DomainSummariesView, DomainSummaryView } from '@rey-one/shared';
import { useAPI } from '~/composables/api';

definePageMeta({
    title: "Domains Management",
    middleware: ['admin']
});

const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: 'active', header: "Status" },
    { accessorKey: "permissions", header: "Permissions" }
] satisfies TableColumn<DomainSummaryView>[]

const { data: response, pending, refresh } = await useAPI<ApiResponse<DomainSummariesView>>('/domains')
const domains = computed(() => response.value?.data.data ?? [])

const globalFilter = ref()
</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <div>
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
            </div>
            <div>
                <RefreshButton @click="refresh" :loading="pending" />
            </div>
        </div>
        <UTable :data="domains" :columns="columns" v-model:global-filter="globalFilter" :loading="pending"
            loading-color="primary" loading-animation="carousel" sticky class="flex-1 overflow-auto">
            <template #active-cell="{ row }">
                <UBadge :color="row.original.active ? 'success' : 'neutral'" label="Active" />
            </template>
        </UTable>
    </div>
</template>
