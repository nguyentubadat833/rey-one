<template>
    <form class="space-y-5">
        <CopyableField v-if="formData.id" :model-value="formData.id" />
        <NameField v-model:name="formData.name"/>
        <UFormField label="Identity" description="Provide at least one: Username, Email, or Phone. " required>
            <div class="space-y-3 pl-4">
                <UsernameField v-model:username="formData.username" />
                <EmailField v-model:email="formData.email" />
                <PhoneField v-model:phone="formData.phone" />
            </div>
        </UFormField>
        <UFormField label="Role">
            <USelectMenu v-model="formData.role" :items="roles?.data" :loading="pending" loading-icon="i-lucide-loader"
                label-key="name" class="w-full" />
        </UFormField>
        <UserStatusField v-model:status="formData.status" required />
    </form>
</template>
<script setup lang="ts">
import { useAsyncAPI } from '~/composables/api';
import CopyableField from '../ui/input/fields/CopyableField.vue';
import useMemberForm from './composables/useMemberForm';
import UsernameField from '../ui/input/fields/UsernameField.vue';
import EmailField from '../ui/input/fields/EmailField.vue';
import PhoneField from '../ui/input/fields/PhoneField.vue';
import UserStatusField from '../ui/input/fields/UserStatusField.vue';
import type { ApiResponse, DomainRoleView } from '@rey-one/shared';
import NameField from '../ui/input/fields/NameField.vue';

const { accessDomainId } = useAccessDomains()
const { memberFormState, loadMember } = useMemberForm()
const formData = toRef(memberFormState, 'data')

const dataKey = `domain:${accessDomainId.value}:roles`

const { data: roles, pending } = await useAsyncAPI<ApiResponse<DomainRoleView[]>>('/domain-roles', {
    key: dataKey,
})

</script>