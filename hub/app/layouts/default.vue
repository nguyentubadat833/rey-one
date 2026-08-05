<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'
import UserCard from '~/components/ui/UserCard.vue';
import useAuth from '~/composables/auth';

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const { isMobile } = useDevice()
const { authState } = useAuth()

const open = ref(true)
const profileState = computed(() => {
    const user = authState.userAuth
    return {
        image: user?.image,
        name: user?.name,
        identity: user?.username ?? user?.email ?? user?.phone
    }
})

const items: NavigationMenuItem[] = [
    {
        label: 'OVERVIEW',
        icon: 'ic:round-pie-chart'
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
            container: 'h-full',
        }">
            <template #header>
                <div class="w-full space-y-5 py-4">
                    <div class="flex justify-between items-center gap-2">
                        <div class="flex gap-2 items-center">
                            <UIcon name="glyphs-poly:grid-add" class="size-8" />
                            <p v-if="open" class=" font-bold">RONE SYSTEM</p>
                        </div>
                        <UIcon v-if="isMobile" name="ic:twotone-close" size="25" @click="open = false" />
                    </div>
                </div>
            </template>

            <UNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-1.5 overflow-hidden' }" />

            <template #footer>
                <div class="w-full" :class="[{ 'flex justify-between items-center gap-2': isMobile }]">
                    <UserCard v-if="isMobile" />
                    <UColorModeSelect v-if="open && !isMobile" class="w-full" />
                    <UColorModeButton v-else />
                </div>
            </template>
        </USidebar>

        <div
            class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
            <div class="h-(--ui-header-height) shrink-0 flex justify-between items-center px-4 " :class="[
                variant !== 'floating' && 'border-b border-default',
                side === 'right' && 'justify-end'
            ]">
                <div v-if="isMobile" class="flex gap-2 items-center">
                    <UIcon name="glyphs-poly:grid-add" class="size-8" />
                    <p class=" font-bold">RONE SYSTEM</p>
                </div>

                <UButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
                    variant="ghost" aria-label="Toggle sidebar" @click="open = !open" />

                <UserCard v-if="!isMobile" />

            </div>

            <div class="flex-1 px-4">
                <slot />
            </div>
        </div>
    </div>
</template>
