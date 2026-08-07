<template>
    <UModal title="Working Domain" v-model:open="open">
        <UButton :label="!selectedDomain?.domainName ? 'No Domain' : selectedDomain.domainName"
            icon="ic:twotone-domain" color="neutral" variant="subtle" block />

        <template #body>
            <form class="space-y-5">
                <UFormField label="Domain ID">
                    <UInput disabled :model-value="selectedDomain?.domainId" :ui="{ trailing: 'pr-0.5' }"
                        icon="ic:baseline-code" class="w-full">
                        <template v-if="selectedDomain?.domainId.length" #trailing>
                            <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
                                <UButton :color="copied ? 'success' : 'neutral'" variant="link" size="sm"
                                    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                                    aria-label="Copy to clipboard" @click="copy(selectedDomain.domainId)" />
                            </UTooltip>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Domain Name">
                    <div class="flex gap-2">
                        <UInput disabled :model-value="selectedDomain?.domainName" icon="ic:round-domain"
                            class="w-full" />
                        <UButton v-if="selectedDomain" label="Leave" icon="ic:baseline-power-off" color="neutral" variant="subtle" @click="leaveDomain"/>
                    </div>
                </UFormField>
            </form>
        </template>

        <template #footer>
            <USelectMenu v-model="accessDomainState.domain" :loading="accessDomainState.loading"
                loading-icon="i-lucide-loader" :items="accessDomainState.list" label-key="domainName" class="w-full"
                @update:model-value="chooseDomain" @update:open="openMenu">
                <template #content-bottom>
                    <div class="p-2 font-bold text-sm">
                        Total organizations:
                        {{ accessDomainState.list?.length ?? 0 }}
                    </div>
                </template>
            </USelectMenu>
            <UiButtonRefresh :loading="accessDomainState.loading" @click="loadDomains" />
        </template>
    </UModal>
</template>
<script setup lang="ts">
import useDomain from '~/composables/domain';
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()
const { accessDomain, accessDomainState } = useDomain()
const { loadDomains, chooseDomain, leaveDomain: leave } = accessDomain()

const open = ref(false)
const selectedDomain = toRef(accessDomainState, 'domain')

function openMenu(){
    if(!accessDomainState.list){
        loadDomains()
    }
}

async function leaveDomain(){
    await leave()

    open.value = false
}
</script>