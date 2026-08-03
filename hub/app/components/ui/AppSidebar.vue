<script setup lang="ts">
import { computed } from "vue";
import useAuth from "~/composables/auth";
import useUI from "~/composables/ui";
import NavMenuItem from "./NavMenuItem.vue";

const { isMobileOrTablet } = useDevice()
const { sidebarOpen, mobileSidebarOpen } = useUI();
const { authState } = useAuth()
// const { baseLinks } = useNav();


const collapsed = computed(() => !sidebarOpen);
const accountInfo = computed(() => {
  if (!authState.user || !authState.authenticated) {
    return null;
  }

  return {
    name: authState.user.name,
    role: authState.user.type
  };
});

type MenuItem = {
  label: string;
  icon: string;
  to?: string;
  children?: MenuItem[];
};

const menus: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    // to: baseLinks.index,
  },
  {
    label: "IAM",
    icon: "i-lucide-shield-cog-corner",
    children: [
      {
        label: "Users",
        icon: "i-lucide-shield-user",
        // to: baseLinks.iam.users,
      },
      {
        label: "Organization",
        icon: "i-lucide-building-2",
        children: [
          {
            label: "Manage",
            icon: "i-lucide-building",
            // to: baseLinks.iam.organization.index,
          },
          {
            label: "Roles",
            icon: "i-lucide-shield-check",
            // to: baseLinks.iam.organization.roles,
          },
          {
            label: "Memberships",
            icon: "i-lucide-users",
            // to: baseLinks.iam.organization.memberships,
          },
        ]
      },
    ],
  },
  {
    label: "Academy",
    icon: "i-lucide-graduation-cap",
    children: [
      {
        label: "Courses",
        icon: "i-lucide-square-library",
        // to: baseLinks.academy.courses,
      },
      {
        label: "Enrollments",
        icon: "i-lucide-users-round",
        // to: baseLinks.academy.enrollments
      },
    ],
  },
  {
    label: "Commerce",
    icon: "i-lucide-badge-dollar-sign",
    children: [
      {
        label: "Sellable",
        icon: "i-lucide-package",
        // to: baseLinks.commerce.sellable,
      },
      {
        label: "Promotions",
        icon: "i-lucide-badge-percent",
        // to: baseLinks.commerce.promotions,
      },
      {
        label: "Orders",
        icon: "i-lucide-shopping-cart",
        // to: baseLinks.commerce.orders,
      },
      {
        label: "Payments",
        icon: "i-lucide-banknote",
        // to: baseLinks.commerce.payments,
      },
    ],
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
  },
];
</script>

<template>
  <aside class="p-1">
    <div v-if="!isMobileOrTablet" :class="[
      'h-full shrink-0 flex flex-col transition-all duration-300 rounded-3xl shadow-sm border dark:border-neutral-800 light:border-gray-200',
      collapsed ? 'w-20' : 'w-72',
    ]">
      <div class="flex h-20 items-center border-b border-neutral-100 px-5">
        <span v-if="!collapsed" class="text-lg font-bold">
          RMK Console
        </span>
        <UIcon v-else name="i-lucide-layers" class="mx-auto text-xl" />
      </div>
      <div class="flex-1 p-3 overflow-hidden overflow-y-auto">
        <nav class="space-y-1">
          <NavMenuItem v-for="item in menus" :key="item.label" :item="item" :collapsed="collapsed" :depth="0" />
        </nav>
      </div>

      <div class="border-t border-neutral-100 p-4">
        <div class="flex items-center gap-3">
          <UAvatar :alt="accountInfo?.name ?? 'image'" size="md" />
          <div v-if="!collapsed">
            <div class="text-sm font-medium">
              {{ accountInfo?.name }}
            </div>
            <div class="text-xs text-neutral-500">
              {{ accountInfo?.role }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <UDrawer v-else v-model:open="mobileSidebarOpen" direction="left">
      <template #content>
        <div class="h-full">
          <div class="border-b border-neutral-100 p-5 text-lg font-bold">
            Remika CMS
          </div>
          <div class="p-3">
            <nav class="space-y-1">
              <NavMenuItem v-for="item in menus" :key="item.label" :item="item" :collapsed="collapsed" :depth="0" />
            </nav>
          </div>
        </div>
      </template>
    </UDrawer>
  </aside>
</template>

<style scoped>
.submenu {
  overflow: hidden;
}
</style>