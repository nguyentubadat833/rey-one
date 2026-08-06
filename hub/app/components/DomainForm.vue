<template>
    <UModal :title="modalTitle">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <form class="space-y-5" @submit.prevent="save">
                <UFormField label="ID">
                    <UInput disabled v-model="formData.id" class="w-full" />
                </UFormField>
                <UFormField label="Name">
                    <UInput v-model="formData.name" class="w-full" />
                </UFormField>
                <UFormField label="Active">
                    <USwitch v-model="formData.active" :default-value="true" />
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
                <SaveButton :loading="formLoading" @click="submit()" />
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

const { domainFormState, save } = useDomain()
const formData = toRef(domainFormState, 'data')
const formLoading = toRef(domainFormState, 'loading')

const modalTitle = computed(() => formData.value.id ? formData.value.name : 'New Domain')

async function submit() {
    formData.value.permissions = permissionChecks.value.filter(item => item.active === true).map(item => item.permissions)

    formLoading.value = true
    try {
        await save()
    } finally {
        formLoading.value = false
    }
}

watch(formData.value, (newValue, oldValue) => {
    permissionChecks.value.forEach(item => {
        item.active = newValue.permissions?.includes(item.permissions) ?? false
    })
})
</script>