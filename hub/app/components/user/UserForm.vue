<template>
  <form class="space-y-6">
    <!-- Section 1: Thông tin cá nhân -->
    <div class="space-y-4">
      <div class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
        Thông tin cá nhân
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Họ và tên -->
        <UFormField label="Họ và tên" required class="sm:col-span-2">
          <UInput
            v-model="formData.name"
            class="w-full"
            placeholder="Huỳnh Văn ..."
            icon="i-heroicons-user"
          />
        </UFormField>

        <!-- Trạng thái tài khoản -->
        <UFormField label="Trạng thái tài khoản" class="sm:col-span-2">
          <USelect
            v-model="formData.status"
            :items="[...USER_STATUSES]"
            default-value="active"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <!-- Section 2: Phương thức xác thực / Đăng nhập -->
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <span class="text-sm font-semibold text-gray-900 dark:text-white">
          Phương thức đăng nhập
        </span>
        <span class="text-xs text-amber-600 dark:text-amber-400 font-medium">
          * Yêu cầu nhập ít nhất 1 trong 3 thông tin username, email hoặc số điện thoại
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
        <!-- Username -->
        <UFormField label="Username" help="Dùng để đăng nhập bằng tên tài khoản">
          <UInput
            v-model="formData.username"
            placeholder="huynhvan_0689"
            icon="i-heroicons-at-symbol"
            class="w-full"
          />
        </UFormField>

        <!-- Email -->
        <UFormField label="Email" help="Dùng để đăng nhập và nhận thông báo">
          <UInput
            v-model="formData.email"
            placeholder="example@gmail.com"
            icon="i-heroicons-envelope"
            class="w-full"
          />
        </UFormField>

        <!-- Số điện thoại -->
        <UFormField label="Số điện thoại" help="Dùng để đăng nhập bằng SĐT / OTP">
          <UInput
            v-model="formData.phone"
            placeholder="0986754234"
            icon="i-heroicons-phone"
            class="w-full"
          />
        </UFormField>

        <!-- Mật khẩu -->
        <UFormField
          label="Mật khẩu"
          help="Bỏ trống nếu muốn hệ thống tự tạo mật khẩu mặc định"
        >
          <PasswordInput v-model:password="formData.password" class="w-full" />
        </UFormField>
      </div>
    </div>

    <!-- Section 3: Phân quyền hệ thống -->
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Quyền hạn tài khoản</h4>
          <p class="text-xs text-gray-500">Gán các quyền thao tác cho người dùng trong hệ thống.</p>
        </div>
      </div>

      <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <UTable
          :data="userFormState.permissionChecks"
          sticky
          class="max-h-[300px]"
        >
          <template #active-cell="{ row }">
            <UCheckbox v-model="row.original.active" />
          </template>
        </UTable>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import useUserForm from "./composables/useUserForm.ts";
import PasswordInput from "../ui/input/PasswordInput.vue";
import { USER_STATUSES } from "@rey-one/shared";

const { userFormState } = useUserForm();
const formData = toRef(userFormState, "data");
</script>