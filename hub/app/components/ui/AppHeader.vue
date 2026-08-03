<script setup lang="ts">
import useAuth from '~/composables/auth';
import useUI from '~/composables/ui';

const { isMobileOrTablet } = useDevice()
const { mobileSidebarOpen } = useUI();
const { authState, logout } = useAuth()

const router = useRouter()


const headerTitle = computed(() => router.currentRoute.value.meta?.title || 'Hub Management Platform');

function toggleSidebar() {
  if (isMobileOrTablet) {
    mobileSidebarOpen.value = true;
  } else {
    toggleSidebar();
  }
}
</script>

<template>
  <!-- <header class="flex h-16 items-center justify-between rounded-3xl border border-neutral-200 bg-white px-5 shadow-sm"> -->
  <header>
    <UCard :ui="{ root: 'rounded-3xl shadow-sm', body: 'flex items-center justify-between px-5 py-2!' }">
      <div class="flex items-center gap-3 ">
        <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" @click="toggleSidebar" />

        <h1 class="font-semibold mobile-hidden">{{ headerTitle }}</h1>
      </div>

      <div class="flex items-center gap-2">
        <UColorModeButton />
        <UButton icon="i-lucide-search" color="neutral" variant="ghost" />
        <UButton icon="i-lucide-bell" color="neutral" variant="ghost" />

        <UDropdownMenu :items="[
          [
            {
              label: 'Profile',
              icon: 'i-lucide-user',
              onClick: () => {
                router.push('/profile')
              }
            },
            {
              label: 'Logout',
              icon: 'i-lucide-log-out',
              color: 'error',
              onClick: () => {
                logout()
              }
            },
          ],
        ]">
          <UButton variant="link">
            <UAvatar :alt="authState.user?.name ?? 'image'" size="md" />
          </UButton>
        </UDropdownMenu>
      </div>
    </UCard>
  </header>
</template>
