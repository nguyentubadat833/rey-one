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
                <UFormField label="Username">
                    <UInput v-model="formData.username" class="w-full" />
                </UFormField>
                <UFormField label="Email">
                    <UInput v-model="formData.email" class="w-full" />
                </UFormField>
                <UFormField label="Phone">
                    <UInput v-model="formData.phone" class="w-full" />
                </UFormField>
                <UFormField label="Status">
                    <USelect v-model="formData.status" :items="[...USER_STATUSES]" class="w-40"/>
                </UFormField>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <CancelButton />
                <SaveButton :loading="userFormState.loading" @click="save()" />
            </div>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import SaveButton from './ui/button/SaveButton.vue';
import CancelButton from './ui/button/CancelButton.vue';
import { USER_STATUSES } from '@rey-one/shared';
import useUser from '~/composables/user.ts';

defineProps<{
    clickIcon?: () => void
}>()

const { userFormState, save } = useUser()
const formData = toRef(userFormState, 'data')

const modalTitle = computed(() => formData.value.id ? formData.value.name : '*New User')

</script>