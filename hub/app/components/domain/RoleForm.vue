<template>
    <UModal v-model:open="open" title="Roles" :description="modalDescription" @after:leave="onLeave">
        <div>
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <form class="space-y-5">
                <UFormField label="ID">
                    <UInput disabled v-model="data.id" class="w-full"
                        placeholder="Leave blank to generate automatically" />
                </UFormField>
                <UFormField label="Name">
                    <UInput :disabled="isView" v-model="data.name" class="w-full"
                        placeholder="Display name for this role" />
                </UFormField>
                <UFormField label="Active">
                    <USwitch :disabled="isView" v-model="data.active" :default-value="true" />
                </UFormField>
                <UFormField label="Permissions">
                    <UTable :data="permissionChecks" sticky class="max-h-[50vh]">
                        <template #active-cell="{ row }">
                            <UCheckbox :disabled="isView" v-model="row.original.active" />
                        </template>
                    </UTable>
                </UFormField>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <CancelButton @click="open = false" />
                <SaveButton v-if="!isView" :loading="loading" @click="submit()" />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { CreateDomainRoleSchema, type ApiResponse, type AppPermission, type DomainRoleView } from '@rey-one/shared';
import { useAPI } from '~/composables/api/index.ts';
import CancelButton from '../ui/button/CancelButton.vue';
import SaveButton from '../ui/button/SaveButton.vue';

const data = defineModel<Partial<DomainRoleView>>('role', {
    default: () => ({})
})

const props = defineProps<{
    leaveAction?: () => void
    type: 'view' | 'edit'
    domainName?: string
    referencePermissions?: AppPermission[]
}>()

const { pushToast } = useNotification()

const isView = props.type === 'view'
const open = ref(false)
const loading = ref(false)
const verion = ref(0)
const modalDescription = computed(() => props.domainName ? props.domainName : undefined)

const permissionChecks = ref<ReturnType<typeof permissionsToChecks>>([])
const snapshotData = ref<Partial<DomainRoleView>>({})

async function submit() {
    if (!isView) return

    const process = async () => {
        let response

        data.value.permissions = permissionChecks.value.filter(item => item.active).map(item => item.permission)
        const isCreate = data.value.id  === undefined

        if (isCreate) {
            const payload = zodValidate(CreateDomainRoleSchema, data.value)
            response = await useAPI<ApiResponse<DomainRoleView>>('/domain-roles', {
                method: 'POST',
                body: payload
            })
            pushToast({
                title: data.value.name,
                description: "Created"
            })
        } else {
            const payload = zodValidate(CreateDomainRoleSchema, data.value)
            response = await useAPI<ApiResponse<DomainRoleView>>(`/domain-roles/${data.value.id}`, {
                method: 'PATCH',
                body: payload
            })
            pushToast({
                title: data.value.name,
                description: "Updated",
                color: "info"
            })
        }

        Object.assign(data, response.data)
    }

    try {
        loading.value = true
        await process()
        ++verion.value
    } finally {
        loading.value = false
    }
}

function onLeave() {
    if (!isView) {
        if (verion.value && props.leaveAction) {
            props.leaveAction()
        } else {
            Object.assign(data.value, toRaw(snapshotData.value))
        }
    }
}

onMounted(() => {
   
    if (data.value) {
        snapshotData.value = structuredClone(toRaw(data.value))
    }
})
</script>