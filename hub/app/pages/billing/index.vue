<script setup lang="ts">
const columns = [
  { accessorKey: 'invoiceNo', header: 'Mã hóa đơn' },
  { accessorKey: 'date', header: 'Ngày thanh toán' },
  { accessorKey: 'amount', header: 'Số tiền' },
  { accessorKey: 'plan', header: 'Gói đăng ký' },
  { accessorKey: 'method', header: 'Phương thức' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const methods = ['Credit Card (**** 4242)', 'PayPal', 'Chuyển khoản (VNPay)']
const statuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Failed']

const invoices = ref(
  Array.from({ length: 20 }, (_, i) => ({
    invoiceNo: `INV-2026-${100 + i}`,
    date: new Date(2026, 0, 20 - i).toLocaleDateString('vi-VN'),
    amount: '$49.00',
    plan: 'Pro Business',
    method: methods[i % methods.length],
    status: statuses[i % statuses.length]
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Thanh toán & Hóa đơn</h1>
      <p class="text-sm text-gray-500">Quản lý các thẻ thanh toán và lịch sử hóa đơn dịch vụ.</p>
    </div>

    <!-- Phương thức thanh toán -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold text-sm">Phương thức thanh toán mặc định</span>
          <UButton size="xs" color="neutral" variant="outline" icon="i-heroicons-plus">
            Thêm thẻ mới
          </UButton>
        </div>
      </template>

      <div class="flex items-center gap-4">
        <UIcon name="i-heroicons-credit-card" class="w-8 h-8 text-primary-500" />
        <div>
          <p class="font-medium text-sm">Visa kết thúc bằng **** 4242</p>
          <p class="text-xs text-gray-500">Hết hạn 12/2028</p>
        </div>
        <UBadge color="neutral" class="ml-auto">Mặc định</UBadge>
      </div>
    </UCard>

    <!-- Bảng hóa đơn -->
    <UCard>
      <template #header>
        <span class="font-semibold text-sm">Lịch sử xuất hóa đơn</span>
      </template>

      <UTable :data="invoices" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Paid' ? 'success' : row.original.status === 'Pending' ? 'warning' : 'error'"
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell>
          <UButton icon="i-heroicons-arrow-down-tray" color="neutral" variant="ghost" size="xs" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>