<template>
    <UModal :title="modalTitle" v-model:open="open" :ui="{ content: 'min-w-[40vw]' }">
        <div @click="clickIcon">
            <slot name="icon"></slot>
            <UButton v-if="!$slots.icon" icon="ic:baseline-edit-note" color="neutral" variant="subtle" />
        </div>

        <template #body>
            <form class="space-y-5" @submit.prevent="save">
                <UFormField v-if="formData.id" label="ID">
                    <UInput disabled :model-value="formData.id" :ui="{ trailing: 'pr-0.5' }" class="w-full">
                        <template v-if="formData.id?.length" #trailing>
                            <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                                <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                                    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                                    aria-label="Copy to clipboard" @click="copy(formData.id)" />
                            </UTooltip>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Name" required>
                    <UInput v-model="formData.name" class="w-full" placeholder="e.g. John Doe" />
                </UFormField>
                <UFormField label="Identity" description="Provide at least one: Username, Email, or Phone. " required>
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
                            <!-- <PhoneInput v-model:model-value="formData.phone" /> -->
                            <UInput v-model="formData.phone" class="w-full" placeholder="e.g. 0912345678"
                                trailing-icon="ic:outline-contact-phone" />
                        </UFormField>
                        <UFormField description="Password" help="Leave blank to generate a password automatically">
                            <PasswordInput v-model:model-value="formData.password" class="w-full" />
                        </UFormField>
                    </div>
                </UFormField>
                <UFormField label="Status">
                    <USelect v-model="formData.status" :items="[...USER_STATUSES]" default-value="active"
                        class="w-40" />
                </UFormField>
                <UFormField label="Domain Members">
                    <template #hint>
                        <ChooseDomainWithRoles v-model:members="members" />
                    </template>
                    <div class="space-y-5">
                        <UTable :data="members">
                            <template #domain-cell="{ row }">
                                {{ row.original.domain.name }}
                            </template>
                            <template #role-cell="{ row }">
                                {{ row.original.role?.name }}
                            </template>
                        </UTable>
                    </div>
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
import { useClipboard } from '@vueuse/core'
import { USER_STATUSES } from "@rey-one/shared";
import useUser from "~/composables/user";
import PasswordInput from "../ui/input/PasswordInput.vue";
import CancelButton from "../ui/button/CancelButton.vue";
import ChooseDomainWithRoles from "../domain/ChooseDomainWithRoles.vue";
import SaveButton from "../ui/button/SaveButton.vue";

defineProps<{
    clickIcon?: () => void;
}>();

const { userFormState, save } = useUser();
const { copy, copied } = useClipboard()

const open = ref(false);
const formData = toRef(userFormState, "data");
const members = computed({
  get: () => formData.value.members,
  set: (val) => { formData.value.members = val }
})

const modalTitle = computed(() =>
    formData.value.id ? formData.value.name : "*New User",
);

watchEffect(() => {
    console.log(members.value)
})
</script>
