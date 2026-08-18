<template>
    <div>
        <UCard>
            <template #title>
                <div class="flex justify-between items-center h-6">
                    Domain
                    <RefreshButton :loading="pending" @click="refresh" />
                </div>
            </template>
            <DomainForm class="pointer-events-none"/>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { ApiResponse, DomainSchema } from '@rey-one/shared';
import { useAPI } from '~/composables/api';
import { permission } from '#imports'
import RefreshButton from '~/components/ui/button/RefreshButton.vue';
import DomainForm from '~/components/domain/DomainForm.vue';
import useDomainForm from '~/components/domain/composables/useDomainForm';
import type z from 'zod';

type Domain = z.infer<typeof DomainSchema>

definePageMeta({
    title: "Domain management",
    middleware: ['domain-user']
})

const { domainFormState } = useDomainForm()
const { createPermissionsChecks } = permission()

const { refresh, pending } = await useAsyncData(() => {
    return useAPI<ApiResponse<Domain>>('/domains/info', {
        onResponse({ response }) {
            if (response.ok) {
                const result = response._data as ApiResponse<Domain>

                Object.assign(domainFormState.data, result.data)
                domainFormState.permissionChecks = createPermissionsChecks({
                    currentPermissions: domainFormState.data.permissions
                })
            }
        }
    })
})
</script>