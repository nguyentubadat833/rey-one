<template>
  <form class="space-y-6">
    <div class="space-y-4">
      <div class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
        Thông tin chung
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField label="Tên doanh nghiệp" required class="sm:col-span-2">
          <UInput
            v-model="domainFormState.data.name"
            placeholder="Công ty TNHH MTV ..."
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email quản trị"
          help="Được dùng làm tài khoản Owner của doanh nghiệp"
          required
          class="sm:col-span-2"
        >
          <UInput
            :disabled="isDisabledField"
            v-model="email"
            placeholder="doanhnghiep@gmail.com"
            icon="i-lucide-at-sign"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Kế hoạch sử dụng" required>
          <USelect
            v-model="data.plan"
            :items="[...SUBSCRIPTION_PLANS]"
            default-value="monthly"
            class="w-full"
          />
        </UFormField>

        <UFormField v-if="data.status" label="Trạng thái hiện tại">
          <div class="h-9 flex items-center">
            <UBadge :color="statusColor" :label="data.status.toUpperCase()" size="md" variant="subtle" />
          </div>
        </UFormField>
      </div>
    </div>

    <div class="space-y-4">
      <div class="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
        Thời hạn gói dịch vụ
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePickerField
          :disabled="isDisabledField"
          label="Ngày bắt đầu"
          v-model:date="domainFormState.data.startedAt"
        />
        <DatePickerField
          label="Ngày kết thúc"
          v-model:date="domainFormState.data.expiresAt"
        />
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Quyền hệ thống</h4>
          <p class="text-xs text-gray-500">Cấu hình các module được phép truy cập cho doanh nghiệp này.</p>
        </div>
      </div>

      <div class="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <UTable
          :data="domainFormState.permissionChecks"
          sticky
          class="max-h-87.5"
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
import { SUBSCRIPTION_PLANS, type DomainStatus } from "@rey-one/shared";
import DatePickerField from "../ui/input/fields/DatePickerField.vue";
import useDomainForm from "./composables/useDomainForm";

const { domainFormState } = useDomainForm();
const data = toRef(domainFormState, "data");

const colors: Record<DomainStatus, any> = {
  active: "success",
  pending: "secondary",
  expiring: "warning",
  inactive: "neutral",
};

const email = computed({
  set: (value) => {
    data.value.owner = {
      email: value,
      status: "pending",
    };
  },
  get: () => data.value.owner?.email ?? "",
});

const statusColor = computed<any>(() =>
  data.value.status ? colors[data.value.status] : "neutral",
);

const isDisabledField = computed(() => !!domainFormState.data.id);
</script>