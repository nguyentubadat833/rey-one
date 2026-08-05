<template>
    <div class="flex items-center gap-3">
        <UAvatar :alt="profileState.image ?? profileState.name" size="md" />
        <div class="flex flex-col">
            <div class="text-sm font-medium">
                {{ profileState.name }}
            </div>
            <div class="text-xs text-neutral-500">
                {{ profileState.identity }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useAuth from '~/composables/auth';

const { authState } = useAuth()

const profileState = computed(() => {
    const user = authState.userAuth
    return {
        image: user?.image,
        name: user?.name,
        identity: user?.username ?? user?.email ?? user?.phone
    }
})

</script>