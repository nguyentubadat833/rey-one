<template>
    <UModal :title="modalTitle">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <form class="space-y-5" @submit.prevent="save">
                <UFormField label="ID">
                    <UInput disabled v-model="state.id" class="w-full" />
                </UFormField>
                <UFormField label="Name">
                    <UInput v-model="state.name" class="w-full" />
                </UFormField>
                <UFormField label="Active">
                    <USwitch v-model="state.active" :default-value="true" />
                </UFormField>
                <UFormField label="Permissions">
                    <UTable :data="permissionChecks" sticky class="max-h-[50vh]">
                        <template #active-cell="{ row }">
                            <UCheckbox v-model="row.original.active" />
                        </template>
                    </UTable>
                </UFormField>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <CancelButton />
                <SaveButton :loading="loading" @click="submit()" />
            </div>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import useDomain from '~/composables/domain';
import SaveButton from './ui/button/SaveButton.vue';
import CancelButton from './ui/button/CancelButton.vue';
import { APP_PERMISSIONS } from '@rey-one/shared';

defineProps<{
    clickIcon?: () => void
}>()

const permissionChecks = ref(
    APP_PERMISSIONS.map((name) => ({
        permissions: name,
        active: false,
    }))
)

const { domainFormState: state, domainFormLoading: loading, save } = useDomain()
const modalTitle = computed(() => state.id ? state.name : 'New Domain')

async function submit() {
    state.permissions = permissionChecks.value.filter(item => item.active).map(item => item.permissions)

    loading.value = true
    try {
        await save()
    } finally {
        loading.value = false
    }
}

watch(toRef(state, 'permissions'), (newValue, oldValue) => {
    permissionChecks.value.forEach(item => {
        item.active = newValue?.includes(item.permissions) ?? false
    })
})
</script>