<template>
    <form class="space-y-5">
        <CopyableField v-if="formData.id" :model-value="formData.id" />
        <NameField v-model:name="formData.name" required />
        <UFormField label="Identity" description="Provide at least one: Username, Email, or Phone. " required>
            <div class="space-y-3 pl-4">
                <UsernameField v-model:username="formData.username" />
                <EmailField v-model:email="formData.email" />
                <PhoneField v-model:phone="formData.phone" />
                <PasswordField v-model:password="formData.password" />
            </div>
        </UFormField>
        <UserStatusField v-model:status="formData.status" required />
        <UFormField label="Permissions">
            <UTable :data="userFormState.permissionChecks" sticky class="max-h-[50vh]">
                <template #active-cell="{ row }">
                    <UCheckbox v-model="row.original.active" />
                </template>
            </UTable>
        </UFormField>
    </form>
</template>
<script setup lang="ts">
import CopyableField from '../ui/input/fields/CopyableField.vue';
import useUserForm from './composables/useUserForm.ts';
import NameField from "../ui/input/fields/NameField.vue";
import UsernameField from "../ui/input/fields/UsernameField.vue";
import EmailField from "../ui/input/fields/EmailField.vue";
import PhoneField from "../ui/input/fields/PhoneField.vue";
import PasswordField from "../ui/input/fields/PasswordField.vue";
import UserStatusField from "../ui/input/fields/UserStatusField.vue";

const { userFormState } = useUserForm()
const formData = toRef(userFormState, 'data')

</script>
