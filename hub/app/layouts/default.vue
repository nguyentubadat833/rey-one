<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'
import Brand from '~/components/ui/Brand.vue';
import AccessDomain from '~/components/ui/AccessDomain.vue';
import UserCard from '~/components/ui/UserCard.vue';

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const { isMobile } = useDevice()

const openSidebar = ref(true)

const items: NavigationMenuItem[] = [
    {
        label: 'Dashboard',
        icon: 'ic:round-pie-chart',
        to: '/'
    },
    {
        label: 'IAM',
        icon: 'ic:twotone-vpn-lock',
        children: [
            {
                label: "Users",
                icon: 'ic:baseline-supervisor-account',
                to: '/iam/users'
            },
            {
                label: "Domains",
                icon: 'ic:round-domain',
                to: '/iam/domains'
            }
        ]
    },
    {
        label: 'Commerce',
        icon: 'ic:round-storefront',
        children: [
            {
                label: 'Products',
                icon: 'ic:outline-web-stories'
            },
            {
                label: 'Orders',
                icon: 'ic:outline-shopping-bag'
            },
            {
                label: 'Promotions',
                icon: 'ic:outline-discount'
            },
            {
                label: 'Payments',
                icon: 'ic:outline-payments'
            }
        ]
    },
    {
        label: 'Contacts',
        icon: 'ic:baseline-all-inbox'
    },
    {
        label: 'Setting',
        icon: 'ic:baseline-settings-suggest',
        // children: [
        //     {
        //         label: "My information",
        //         icon: 'ic:sharp-manage-accounts'
        //     }
        // ]
    },
    // {
    //     label: 'Leave',
    //     icon: 'ic:baseline-log-out'
    // }
]
</script>

<template>
    <div class="flex flex-1" :class="[
        variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
        side === 'right' && 'flex-row-reverse'
    ]">
        <USidebar v-model:open="openSidebar" variant="floating" collapsible="icon" :close="true" :side="side" :ui="{
            container: 'h-full',
        }">
            <template #header>
                <div class="w-full space-y-5 py-4">
                    <div class="flex justify-between items-center gap-2">
                        <Brand :show-name="openSidebar" />
                        <UIcon v-if="isMobile" name="ic:twotone-close" size="25" @click="openSidebar = false" />
                    </div>
                    <AccessDomain />
                </div>
            </template>

            <UNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-1.5 overflow-hidden' }" />

            <template #footer>
                <div class="w-full" :class="[{ 'flex justify-between items-center gap-2': isMobile }]">
                    <UserCard />
                    <!-- <UColorModeSelect v-if="openSidebar && !isMobile" class="w-full" />
                    <UColorModeButton v-else /> -->
                </div>
            </template>
        </USidebar>

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
