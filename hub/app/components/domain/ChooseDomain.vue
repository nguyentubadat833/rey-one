<template>
    <UModal title="Working Domain" v-model:open="open">
        <UButton :label="!selectedDomain?.name ? 'No Domain' : selectedDomain.name" icon="ic:twotone-domain"
            color="neutral" variant="subtle" block />

        <template #body>
            <form class="space-y-5">
                <UFormField label="Domain ID">
                    <UInput disabled :model-value="selectedDomain?.id" :ui="{ trailing: 'pr-0.5' }"
                        icon="ic:baseline-code" class="w-full">
                        <template v-if="selectedDomain?.id.length" #trailing>
                            <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                                <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                                    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                                    aria-label="Copy to clipboard" @click="copy(selectedDomain.id)" />
                            </UTooltip>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Domain Name">
                    <div class="flex gap-2">
                        <UInput disabled :model-value="selectedDomain?.name" icon="ic:round-domain"
                            class="w-full" />
                        <UButton v-if="selectedDomain" label="Leave" icon="ic:baseline-power-off" color="neutral"
                            variant="subtle" @click="leaveDomain" />
                    </div>
                </UFormField>
            </form>
        </template>

        <template #footer>
            <USelectMenu v-model="accessDomainState.domain" :loading="accessDomainState.loading"
                loading-icon="i-lucide-loader" :items="accessDomainState.list" label-key="name" class="w-full"
                @update:model-value="selecteDomain" @update:open="openMenu">
                <template #content-bottom>
                    <div class="p-2 font-bold text-sm">
                        Total Domains:
                        {{ accessDomainState.list?.length ?? 0 }}
                    </div>
                </template>
            </USelectMenu>
            <RefreshButton :loading="accessDomainState.loading" @click="loadDomains" />
        </template>
    </UModal>
</template>
<script setup lang="ts">
import { useAccessDomains } from '~/composables/domain';
import { useClipboard } from '@vueuse/core'
import RefreshButton from '../ui/button/RefreshButton.vue';
import type z from 'zod';
import type { DomainAvailableSchema } from '@rey-one/shared';

const { copy, copied } = useClipboard()
const { accessDomainState, loadDomains, chooseDomain, leaveDomain: leave } = useAccessDomains()

const open = ref(false)
const selectedDomain = toRef(accessDomainState, 'domain')

function openMenu() {
    if (!accessDomainState.list) {
        loadDomains()
    }
}

async function leaveDomain() {
    await leave()

    open.value = false
}

async function selecteDomain(value: z.infer<typeof DomainAvailableSchema>) {
    await chooseDomain(value)
    await navigateTo('/')
}
</script>