<script setup lang="ts">
import type { BaseLoginSchema } from '@rey-one/shared';
import type z from 'zod';
import useAuth from '~/composables/auth';

definePageMeta({
  layout: false
})

const { login } = useAuth();

const loading = ref(false)
const form = reactive<z.input<typeof BaseLoginSchema>>({
  identity: "",
  password: "",
});

const submit = async () => {

  loading.value = true

  try {
    await login(form)
    await navigateTo('/')
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="h-screen grid place-items-center">
    <div class="w-full max-w-md ">
      <UCard class="rounded-2xl">
        <template #header>
          <div class="space-y-1">
            <h1 class="text-2xl font-bold">Đăng nhập</h1>

            <p class="text-sm text-gray-500">Welcome back</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="submit">
          <UFormField label="Username">
            <UInput v-model="form.identity" type="username" placeholder="username" class="w-full" />
          </UFormField>

          <UFormField label="Password">
            <UInput v-model="form.password" type="password" placeholder="********" class="w-full" />
          </UFormField>

          <UButton label="Đăng nhập" type="submit" block :loading="loading" />
        </form>
      </UCard>
    </div>
  </div>
</template>
