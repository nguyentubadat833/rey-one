<template>
    <UModal title="Domain Available">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
           <UTable :data="data?.data" :columns="columns">
                <template #no-cell="{ row }">{{ row.index + 1 }}</template>
            </UTable>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { DomainWithRolesView } from '@rey-one/shared';
import useDomain from '~/composables/domain';

defineProps<{
    clickIcon?: () => void
}>()

const columns = [
    { id: "no" },
    { accessorKey: "name", header: "Name" },
    { id: 'type', header: "Selected Role" },
] satisfies TableColumn<DomainWithRolesView>[]

const { loadAvailable } = useDomain()

const { data, pending, refresh } = useLazyAsyncData('domain-available', () => loadAvailable())

</script>