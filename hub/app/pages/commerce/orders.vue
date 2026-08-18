<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { accessorKey: 'customer', header: 'Khách hàng' },
  { accessorKey: 'createdAt', header: 'Ngày tạo' },
  { accessorKey: 'total', header: 'Tổng tiền' },
  { accessorKey: 'paymentStatus', header: 'Thanh toán' },
  { accessorKey: 'orderStatus', header: 'Trạng thái đơn' },
  { accessorKey: 'actions', header: '' }
]

const statuses = ['Hoàn thành', 'Đang xử lý', 'Đã hủy', 'Đang giao']
const payments = ['Đã thanh toán', 'Chờ thanh toán', 'Hoàn tiền']

const orders = ref(
  Array.from({ length: 25 }, (_, i) => ({
    code: `ORD-${202600 + i}`,
    customer: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
    createdAt: new Date(2026, 7, 19 - i).toLocaleDateString('vi-VN'),
    total: `${((i + 1) * 450).toLocaleString('vi-VN')}.000 đ`,
    paymentStatus: payments[i % payments.length],
    orderStatus: statuses[i % statuses.length]
  }))
)

const filtered = computed(() => {
  if (!search.value) return orders.value
  return orders.value.filter(o =>
    Object.values(o).some(v => String(v).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Đơn hàng</h1>
        <p class="text-sm text-gray-500">Theo dõi toàn bộ đơn hàng phát sinh của tenant.</p>
      </div>
      <UButton icon="i-heroicons-arrow-down-tray" color="neutral" variant="outline">Export Excel</UButton>
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Tìm mã đơn, tên khách..." class="max-w-xs" />
      </div>

      <UTable :data="filtered" :columns="columns">
        <template #paymentStatus-cell="{ row }">
          <UBadge
            :color="row.original.paymentStatus === 'Đã thanh toán' ? 'success' : row.original.paymentStatus === 'Chờ thanh toán' ? 'warning' : 'error'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.paymentStatus }}
          </UBadge>
        </template>
        <template #orderStatus-cell="{ row }">
          <UBadge
            :color="row.original.orderStatus === 'Hoàn thành' ? 'success' : row.original.orderStatus === 'Đang xử lý' ? 'primary' : 'neutral'"
            variant="solid"
            size="xs"
          >
            {{ row.original.orderStatus }}
          </UBadge>
        </template>
        <template #actions-cell>
          <UButton icon="i-heroicons-eye" color="neutral" variant="ghost" size="xs" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>