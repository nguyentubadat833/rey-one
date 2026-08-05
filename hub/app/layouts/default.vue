<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const { isMobile, isMobileOrTablet } = useDevice()
const open = ref(true)

const items: NavigationMenuItem[] = [
    {
        label: 'OVERVIEW',
        icon: 'ic:round-pie-chart'
    },
    {
        label: 'Access Management',
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
        children: [
            {
                label: "My information",
                icon: 'ic:sharp-manage-accounts'
            }
        ]
    },
    {
        label: 'Leave',
        icon: 'ic:baseline-log-out'
    }
]
</script>

<template>
    <div class="flex flex-1" :class="[
        variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
        side === 'right' && 'flex-row-reverse'
    ]">
        <USidebar v-model:open="open" variant="floating" collapsible="icon" :side="side" :ui="{
            header: 'flex justify-between',
            container: 'h-full'
        }">
            <template #header>
                <div class="flex gap-2 items-center">
                    <UIcon name="glyphs-poly:grid-add" class="size-8" />
                    <p v-if="open" class=" font-bold">RONE SYSTEM</p>
                </div>
                <UIcon v-if="isMobile" name="ic:twotone-close" size="25" @click="open = false" />
            </template>

            <UNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-1.5 overflow-hidden' }" />
        </USidebar>

        <div
            class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
            <div class="h-(--ui-header-height) shrink-0 flex justify-between items-center px-4 " :class="[
                variant !== 'floating' && 'border-b border-default',
                side === 'right' && 'justify-end'
            ]">
                <div v-if="isMobileOrTablet" class="flex gap-2 items-center">
                    <UIcon name="glyphs-poly:grid-add" class="size-8" />
                    <p class=" font-bold">RONE SYSTEM</p>
                </div>

                <UButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
                    variant="ghost" aria-label="Toggle sidebar" @click="open = !open" />
            </div>

            <div class="flex-1 p-4">
                <div class="size-full">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
