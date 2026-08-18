<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'id', header: 'Mã đăng ký' },
  { accessorKey: 'planName', header: 'Gói dịch vụ' },
  { accessorKey: 'billingCycle', header: 'Chu kỳ' },
  { accessorKey: 'startDate', header: 'Ngày bắt đầu' },
  { accessorKey: 'endDate', header: 'Ngày hết hạn' },
  { accessorKey: 'amount', header: 'Chi phí' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const plans = ['Pro Business', 'Enterprise', 'Starter Free', 'Custom Addon']
const cycles = ['Hàng tháng', 'Hàng năm']
const statuses = ['Active', 'Expired', 'Cancelled', 'Pending']

// Fake 20+ records dữ liệu lịch sử đăng ký gói của Tenant
const subscriptions = ref(
  Array.from({ length: 22 }, (_, i) => {
    const isCurrent = i === 0
    const status = isCurrent ? 'Active' : statuses[(i % 3) + 1]
    const plan = isCurrent ? 'Pro Business' : plans[i % plans.length]
    
    return {
      id: `SUB-${202600 + i}`,
      planName: plan,
      billingCycle: cycles[i % cycles.length],
      startDate: new Date(2026, 0, 1 - i * 30).toLocaleDateString('vi-VN'),
      endDate: new Date(2026, 0, 31 - i * 30).toLocaleDateString('vi-VN'),
      amount: plan === 'Starter Free' ? '$0' : plan === 'Enterprise' ? '$1,990' : '$490',
      status: status,
      isCurrent: isCurrent
    }
  })
)

const filteredSubscriptions = computed(() => {
  if (!search.value) return subscriptions.value
  return subscriptions.value.filter(sub =>
    Object.values(sub).some(val => String(val).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Gói đăng ký</h1>
        <p class="text-sm text-gray-500">Theo dõi thông tin gói cước hiện tại và lịch sử gia hạn dịch vụ.</p>
      </div>
      <div class="flex gap-3">
        <UButton icon="i-heroicons-arrow-up-circle" color="primary">
          Nâng cấp gói mới
        </UButton>
      </div>
    </div>

    <!-- Active Subscription Highlight Card -->
    <UCard class="bg-gradient-to-r from-primary-500/10 via-transparent to-transparent border-primary-500/30">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Gói đang hoạt động</span>
            <UBadge color="success" variant="subtle" size="xs">Active</UBadge>
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Pro Business Plan</h2>
          <p class="text-xs text-gray-500">Chu kỳ: Hàng năm • Tự động gia hạn vào 31/12/2026</p>
        </div>
        <div class="flex items-center gap-3">
          <UButton color="neutral" variant="outline" size="sm">Hủy gia hạn</UButton>
          <UButton color="primary" size="sm">Thay đổi gói</UButton>
        </div>
      </div>
    </UCard>

    <!-- Subscription History Table -->
    <UCard>
      <template #header>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span class="font-semibold text-sm">Lịch sử đăng ký & Gia hạn</span>
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Tìm mã, tên gói..."
            class="max-w-xs"
          />
        </div>
      </template>

      <UTable :data="filteredSubscriptions" :columns="columns">
        <template #planName-cell="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white">{{ row.original.planName }}</span>
            <UBadge v-if="row.original.isCurrent" color="primary" variant="solid" size="xs">
              Hiện tại
            </UBadge>
          </div>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="
              row.original.status === 'Active'
                ? 'success'
                : row.original.status === 'Pending'
                ? 'warning'
                : row.original.status === 'Cancelled'
                ? 'error'
                : 'neutral'
            "
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu
            :items="[
              [
                { label: 'Xem chi tiết', icon: 'i-heroicons-eye' },
                { label: 'Tải hợp đồng/Hóa đơn', icon: 'i-heroicons-arrow-down-tray' }
              ]
            ]"
          >
            <UButton icon="i-heroicons-ellipsis-horizontal" color="neutral" variant="ghost" size="xs" />
          </UDropdownMenu>
        </template>
      </UTable>
    </UCard>
  </div>
</template>