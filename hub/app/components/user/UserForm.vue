<template>
    <form class="space-y-5">
        <CopyableField v-if="formData.id" :model-value="formData.id" />
        <NameField v-model:name="formData.name" required />
        <UFormField label="Identity" description="Provide at least one: Username, Email, or Phone. " required>
            <div class="space-y-3 pl-4">
                <UsernameField v-model:username="formData.username" />
                <EmailField v-model:email="formData.email"/>
                <PhoneField v-model:phone="formData.phone" />
                <PasswordField v-model:password="formData.password"/>
            </div>
        </UFormField>
        <UserStatusField v-model:status="formData.status" required/>
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
<script setup lang="ts">
import ChooseDomainWithRoles from "../domain/ChooseDomainWithRoles.vue";
import CopyableField from '../ui/input/binding-input/CopyableField.vue';
import useUserForm from './composables/useUserForm.ts';
import NameField from "../ui/input/binding-input/NameField.vue";
import UsernameField from "../ui/input/binding-input/UsernameField.vue";
import EmailField from "../ui/input/binding-input/EmailField.vue";
import PhoneField from "../ui/input/binding-input/PhoneField.vue";
import PasswordField from "../ui/input/binding-input/PasswordField.vue";
import UserStatusField from "../ui/input/binding-input/UserStatusField.vue";

const { userFormState } = useUserForm()
const formData = toRef(userFormState, 'data')

const members = computed({
    get: () => userFormState.data.members,
    set: (val) => { userFormState.data.members = val }
})
</script>
