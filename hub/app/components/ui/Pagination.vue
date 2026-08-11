<template>
    <div class="flex justify-end border-t border-default pt-4 px-4">
        <UPagination :page="data?.paginationParams.page" :items-per-page="data?.paginationParams.limit" :total="data.totalRows.value"
            @update:page="(p) => {
                data.updatePage(p)
            }" />
    </div>
</template>

<script setup lang="ts">
import type { createPaginationQuery } from '~/composables/api/pagination-query';

type PaginationData = ReturnType<typeof createPaginationQuery>

const data = defineModel<PaginationData>('data', {
    required: true
})
</script>