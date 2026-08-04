<script setup lang="ts">
import AppHeader from '~/components/ui/AppHeader.vue';
import AppSidebar from '~/components/ui/AppSidebar.vue';

</script>

<template>
    <div class="h-screen overflow-hidden p-4">
        <div class="flex h-full overflow-hidden gap-4">
            <AppSidebar />

            <div class="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-1">
                <AppHeader />

                <main class="flex-1 min-w-0 overflow-y-auto overflow-x-hidden rounded-3xl p-6 shadow-sm border light:border-gray-200 dark:border-neutral-800">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>
