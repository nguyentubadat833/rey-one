<script setup lang="ts">
import type { SidebarProps } from '@nuxt/ui'
import Brand from '~/components/ui/Brand.vue';
import UserCard from '~/components/ui/UserCard.vue';
import useUI from '~/composables/ui/ui';
import Sidebar from '~/components/ui/Sidebar.vue';
import useDomain from '~/composables/domain';

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const { isMobile } = useDevice()
const { openSidebar } = useUI()

const { accessDomain } = useDomain()
const { loadWorkingDomain } = accessDomain()

onBeforeMount(() => {
    loadWorkingDomain()
})
</script>

<template>
    <div class="flex flex-1" :class="[
        variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
        side === 'right' && 'flex-row-reverse'
    ]">
        <Sidebar :side="side" />

        <div
            class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
            <div class="h-(--ui-header-height) shrink-0 flex justify-between items-center px-4 " :class="[
                variant !== 'floating' && 'border-b border-default',
                side === 'right' && 'justify-end'
            ]">
                <div class="flex justify-between items-center w-full">
                    <Brand v-if="isMobile" :show-name="isMobile" />

                    <UButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
                        variant="ghost" aria-label="Toggle sidebar" @click="openSidebar = !openSidebar" />
                    <div v-if="!isMobile">
                        <UserCard />
                    </div>
                </div>
            </div>
            <div class="flex-1 p-4">
                <slot />
            </div>
        </div>
    </div>
</template>
