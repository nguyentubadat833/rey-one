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
                <ChooseDomain />
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
import ChooseDomain from '../domain/ChooseDomain.vue';

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
const userType = computed(() => authState.userAuth?.scope.type)

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
        label: 'Plan',
        icon: 'ic:sharp-calendar-month',
        children: [
            {
                label: 'Subscription',
                icon: 'ic:sharp-file-download-done',
                to: '/plan/subscription'
            }
        ]
    },
    {
        label: 'Audit',
        icon: 'ic:outline-safety-check',
        children: [
            {
                label: 'System logs',
                icon: 'ic:outline-history',
                to: '/audit/system-logs'
            },
           {
                label: 'Email logs',
                icon: 'ic:round-alternate-email',
                to: '/audit/email-logs'
            }
        ]
    },
    {
        label: 'Billing & Invoice',
        icon: 'ic:baseline-list-alt',
        children: [
            {
                label: 'Billing',
                icon: 'ic:sharp-request-page',
                to: '/billing'
            }
        ]
    },
    {
        label: 'Usage & Quotas',
        icon: 'ic:twotone-storage',
        children: [
            {
                label: 'Usage',
                icon: 'ic:baseline-data-usage',
                to: '/usage'
            }
        ]
    },
    // {
    //     label: 'Contacts',
    //     icon: 'ic:baseline-all-inbox'
    // },
    {
        label: 'Setting',
        icon: 'ic:baseline-settings-suggest',
        to: '/setting'
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
                label: "Information",
                icon: 'ic:outline-business',
                to: '/iam/domain'
            },
            {
                label: "Members",
                icon: 'ic:baseline-supervisor-account',
                to: '/iam/domain/members'
            }
        ]
    },
    {
        label: "CRM",
        icon: "ic:sharp-contacts",
        children: [
            {
                label: "Customer",
                icon: "ic:baseline-groups",
                to: '/crm/customer'
            },
            {
                label: "Leads",
                icon: "ic:baseline-personal-injury",
                to: '/crm/leads'
            },
            {
                label: "Deals",
                icon: "ic:sharp-person-add-alt-1",
                to: '/crm/deals'
            }
        ]
    },
    {
        label: "Catalog",
        icon: "ic:baseline-style",
        children: [
            {
                label: "Products",
                icon: "ic:baseline-layers",
                to: '/catalog/products'
            },
            {
                label: "Suppliers",
                icon: "ic:twotone-switch-account",
                to: '/catalog/suppliers'
            }
        ]
    },
    {
        label: 'Commerce',
        icon: 'ic:round-storefront',
        children: [
            // {
            //     label: 'Products',
            //     icon: 'ic:outline-web-stories',
            //     to: '/commerce/products'
            // },
            {
                label: 'Orders',
                icon: 'ic:outline-shopping-bag',
                to: '/commerce/orders'
            },
            // {
            //     label: 'Promotions',
            //     icon: 'ic:outline-discount'
            // },
            {
                label: 'Payments',
                icon: 'ic:outline-payments',
                to: '/commerce/payments'
            }
        ]
    },
    // {
    //     label: 'Contacts',
    //     icon: 'ic:baseline-all-inbox'
    // },
    {
        label: 'Setting',
        icon: 'ic:baseline-settings-suggest',
        to: '/setting'
    },
]

const items = ref<NavigationMenuItem[]>([])

function setItems(domain: typeof domainAccess.value) {
    if (userType.value === 'system') {
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