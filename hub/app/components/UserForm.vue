<template>
    <UModal :title="modalTitle">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <form class="space-y-5" @submit.prevent="save">
                <UFormField label="ID">
                    <UInput disabled v-model="formData.id" class="w-full"
                        placeholder="Leave blank to generate automatically" />
                </UFormField>
                <UFormField label="Name" required>
                    <UInput v-model="formData.name" class="w-full" placeholder="e.g. John Doe" />
                </UFormField>
                <UFormField label="Identity" help="Provide at least one: Username, Email, or Phone." required>
                    <div class="space-y-3 pl-4">
                        <UFormField description="Username">
                            <UInput v-model="formData.username" class="w-full" placeholder="e.g. john_doe"
                                trailing-icon="ic:baseline-person-outline" />
                        </UFormField>
                        <UFormField description="Email">
                            <UInput v-model="formData.email" class="w-full" placeholder="e.g. john@example.com"
                                trailing-icon="ic:baseline-alternate-email" />
                        </UFormField>
                        <UFormField description="Phone">
                            <PhoneInput v-model:model-value="formData.phone"/>
                            <!-- <UInput v-model="formData.phone" class="w-full" placeholder="e.g. 0912345678"
                                trailing-icon="ic:outline-contact-phone" /> -->
                        </UFormField>
                    </div>
                </UFormField>
                <UFormField label="Password" help="Leave blank to generate a password automatically.">
                    <PasswordInput v-model:model-value="formData.password" class="w-full"/>
                </UFormField>
                <UFormField label="Status">
                    <USelect v-model="formData.status" :items="[...USER_STATUSES]" default-value="active"
                        class="w-40" />
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
import PasswordInput from './ui/input/PasswordInput.vue';
import PhoneInput from './ui/input/PhoneInput.vue';

defineProps<{
    clickIcon?: () => void
}>()

const { userFormState, save } = useUser()
const formData = toRef(userFormState, 'data')

const modalTitle = computed(() => formData.value.id ? formData.value.name : '*New User')

</script>