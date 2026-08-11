<template>
    <UModal v-model:open="open" title="Domain Available"
        :ui="{ content: 'min-h-[70vh] min-w-[35vw]', body: 'space-y-5', footer: 'flex justify-end' }"
        @after:leave="modalLeave">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <div class="flex gap-3">
                <USelectMenu v-model="selectDomains" multiple :loading="domainAvailableLoaidng"
                    loading-icon="i-lucide-loader" :items="[...domainAvailable]" :ui="{ content: 'max-h-[40vh]' }"
                    class="w-full" label-key="name" @update:model-value="selectedDomainAvailable">
                    <template #item-description="{ item }">{{ item.id }}</template>
                    <template #content-bottom>
                        <div class="p-2 font-bold text-sm">
                            Total domains:
                            {{ domainAvailable?.length ?? 0 }}
                        </div>
                    </template>
                </USelectMenu>
            </div>
            <UTable :data="data" :columns="columns" sticky>
                <template #no-cell="{ row }">{{ row.index + 1 }}</template>
                <template #domain-cell="{ row }">{{ row.original.domain.name }}</template>
                <template #role-cell="{ row }">
                    <USelectMenu :default-value="findDomainRole(row.original.domain.id, row.original.role?.id)"
                        :items="getDomainRoles(row.original.domain.id)" class="min-w-36" label-key="name"
                        @update:model-value="(values) => selectedDomainRole(values, toRef(row.original, 'role'))" />
                </template>
                <template #actions-cell="{ row }">
                    <UButton icon="ic:baseline-delete-forever" color="error" @click="removeDomain(row.index)" />
                </template>
            </UTable>
        </template>

        <template #footer>
            <UButton label="Finish" @click="open = false" />
        </template>
    </UModal>
</template>
<script setup lang="ts">
import type z from 'zod';
import type { TableColumn } from '@nuxt/ui';
import type { ApiResponse, DomainRoleView, DomainWithRolesView, UserMemberSchema } from '@rey-one/shared';
import { useDomainUtils } from '~/composables/domain';

type UserMember = z.infer<typeof UserMemberSchema>
type MemberRole = UserMember['role']
defineProps<{
    clickIcon?: () => void
}>()

const data = defineModel<UserMember[]>('members', {
    default: () => []
})

const columns = [
    { id: "no" },
    { accessorKey: "domain", header: "Domain name" },
    { accessorKey: 'role', header: "Assign Role", size: 10000 },
    { id: 'actions' }
] satisfies TableColumn<DomainWithRolesView>[]

const { loadAvailable } = useDomainUtils()

const { data: domainAvailable, pending: domainAvailableLoaidng } = useLazyAsyncData('domain-available', () => loadAvailable(), {
    transform: (value: ApiResponse<DomainWithRolesView[]>) => {
        return value.data
    }
})

const open = ref(false)
const selectDomains = ref<DomainWithRolesView[]>([])

function selectedDomainAvailable(values: DomainWithRolesView[]) {
    values.forEach(value => {
        if (!data.value.find(item => item.domain.id === value.id)) {
            data.value = [{
                domain: {
                    id: value.id,
                    name: value.name
                },
                role: undefined
            },
            ...data.value
            ]
        }
    })
}

function selectedDomainRole(value: DomainRoleView, memberRole: Ref<MemberRole>) {
    memberRole.value = {
        id: value.id,
        name: value.name
    }
}

function getDomainRoles(domainId: string,) {
    return domainAvailable.value?.find(item => item.id === domainId)?.roles ?? []
}

function findDomainRole(domainId: string, roleId?: string) {
    if (!roleId) return undefined

    return getDomainRoles(domainId).find(item => item.id === roleId)
}

async function removeDomain(index: number) {
    data.value = data.value.filter((_, i) => i !== index)
    selectDomains.value = []
}

async function modalLeave() {
    data.value = data.value.filter(item => !!item.role)
    selectDomains.value = []
}
</script>