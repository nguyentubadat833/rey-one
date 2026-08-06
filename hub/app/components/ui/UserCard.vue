<template>
    <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-44' }"
        >
          <UButton
            v-bind="user"
            :label="user?.name"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="w-full data-[state=open]:bg-elevated overflow-hidden"
            :ui="{
              leadingAvatar: 'w-8 h-8',
              trailingIcon: 'text-dimmed ms-auto'
            }"
          />
        </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import useAuth from '~/composables/auth';

const colorMode = useColorMode()
const { authState } = useAuth()

const user = computed(() => {
    const user = authState.userAuth
    return {
        name: user?.name ?? user?.email ?? user?.username ?? user?.phone ?? "User",
        avatar: {
            src: user?.image ?? undefined,
            alt: user?.name
        }
    }
})

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'My Profile',
      icon: 'ic:baseline-account-circle'
    },
    {
        label: "Password",
        icon: 'ic:baseline-password'
    }
    // {
    //   label: 'Billing',
    //   icon: 'i-lucide-credit-card'
    // },
    // {
    //   label: 'Settings',
    //   icon: 'i-lucide-settings',
    //   to: '/settings'
    // }
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'light'
            }
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'dark'
            }
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        }
      ]
    }
  ],
  [
    // {
    //   label: 'GitHub',
    //   icon: 'i-simple-icons-github',
    //   to: 'https://github.com/nuxt/ui',
    //   target: '_blank'
    // },
    {
      label: 'Log out',
      icon: 'i-lucide-log-out'
    }
  ]
])

</script>