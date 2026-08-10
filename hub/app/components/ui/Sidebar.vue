<template>
    <USidebar v-model:open="openSidebar" variant="floating" collapsible="icon" :close="true" :side="side" :ui="{
        container: 'h-full',
    }">
        <template #header>
            <div class="w-full space-y-5 py-4">
                <div class="flex justify-between items-center gap-2">
                    <Brand :show-name="openSidebar" />
                    <UIcon v-if="isMobile" name="ic:twotone-close" size="25" @click="openSidebar = false" />
                </div>
                <ChooseDomainAccess />
            </div>
        </template>

        <UNavigationMenu :items="items" orientation="vertical" :ui="{ link: 'p-1.5 overflow-hidden' }" />

        <template #footer>
            <div class="w-full" :class="[{ 'flex justify-between items-center gap-2': isMobile }]">
                <UserProfileCard />
            </div>
        </template>
    </USidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import useUI from '~/composables/ui/ui';
import useAuth from '~/composables/auth.ts';
import { useAccessDomains } from '~/composables/domain.ts';
import Brand from './Brand.vue';
import UserProfileCard from '../user/UserProfileCard.vue';
import ChooseDomainAccess from '../domain/ChooseDomainAccess.vue';

withDefaults(
    defineProps<{
        side: "left" | "right" | undefined
    }>(),
    {
        side: undefined
    }
)

const { isMobile } = useDevice()
const { openSidebar } = useUI()
const { authState } = useAuth()
const { accessDomainState } = useAccessDomains()

const domainAccess = computed(() => accessDomainState.domain)
const userType = computed(() => authState.userAuth?.type)

const adminItems: NavigationMenuItem[] = [
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
        label: 'Contacts',
        icon: 'ic:baseline-all-inbox'
    },
    {
        label: 'Setting',
        icon: 'ic:baseline-settings-suggest',
    },
]

const domainItems: NavigationMenuItem[] = [
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
                label: "Domain",
                icon: 'ic:outline-business',
                to: '/iam/domain'
            },
            {
                label: "Members",
                icon: 'ic:baseline-supervisor-account',
                to: '/iam/members'
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
    },
]

const items = ref<NavigationMenuItem[]>([])

function setItems(domain: typeof domainAccess.value) {
    if (userType.value === 'admin_user') {
        items.value = domain ? domainItems : adminItems
    } else {
        if (domain) {
            items.value = domainItems
        }
    }
}

watch(domainAccess, (domain) => {
    setItems(domain)
})

onBeforeMount(() => {
    setItems(domainAccess.value)
})
</script>