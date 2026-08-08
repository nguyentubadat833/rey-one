<script setup lang="ts">
import useAuth from '~/composables/auth';

definePageMeta({
  layout: false
})

const { login, authFormState } = useAuth();
const loading = ref(false)
const showPassword = ref(false)

const submit = async () => {
  loading.value = true

  try {
    await login(
      async () => {
        await navigateTo('/')
      }
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-950">
    <!-- Left branding panel -->
    <div class="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none"
           style="background-image: radial-gradient(circle at 20% 20%, white 1px, transparent 1px); background-size: 28px 28px;" />

      <div class="relative z-10 flex items-center gap-2">
        <UIcon name="i-lucide-layers" class="size-7" />
        <span class="text-xl font-bold tracking-tight">RONE</span>
      </div>

      <div class="relative z-10 space-y-4 max-w-md">
        <h2 class="text-3xl font-bold leading-tight">
          Nền tảng quản lý đa lĩnh vực cho doanh nghiệp của bạn
        </h2>
        <p class="text-white/80 text-sm leading-relaxed">
          Bán hàng, khoá học, đặt lịch, CRM và kho vận — tất cả trong một nơi duy nhất.
        </p>
      </div>

      <p class="relative z-10 text-xs text-white/60">
        © {{ new Date().getFullYear() }} RONE. All rights reserved.
      </p>
    </div>

    <!-- Right form panel -->
    <div class="flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-sm">
        <!-- Mobile-only logo -->
        <div class="lg:hidden flex items-center gap-2 mb-8 justify-center">
          <UIcon name="i-lucide-layers" class="size-6 text-primary-600" />
          <span class="text-lg font-bold">Remika</span>
        </div>

        <div class="space-y-1.5 mb-8">
          <h1 class="text-2xl font-bold tracking-tight">Đăng nhập</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chào mừng trở lại, vui lòng nhập thông tin của bạn
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <UFormField label="Tên đăng nhập" name="identity">
            <UInput
              v-model="authFormState.identity"
              type="text"
              placeholder="username"
              icon="i-lucide-user"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Mật khẩu" name="password">
            <UInput
              v-model="authFormState.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :padded="false"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="flex items-center justify-between text-sm">
            <UCheckbox label="Ghi nhớ đăng nhập" />
            <ULink to="/forgot-password" class="text-primary-600 font-medium">
              Quên mật khẩu?
            </ULink>
          </div>

          <UButton
            label="Đăng nhập"
            type="submit"
            block
            size="lg"
            :loading="loading"
            icon="i-lucide-log-in"
          />
        </form>
      </div>
    </div>
  </div>
</template>