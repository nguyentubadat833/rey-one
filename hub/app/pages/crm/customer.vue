<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'id', header: 'Mã KH' },
  { accessorKey: 'name', header: 'Tên khách hàng' },
  { accessorKey: 'phone', header: 'Số điện thoại' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'totalOrders', header: 'Đơn hàng' },
  { accessorKey: 'spent', header: 'Tổng chi tiêu' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const customers = ref(
  Array.from({ length: 22 }, (_, i) => ({
    id: `CUST-${1000 + i}`,
    name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
    phone: `0988${Math.floor(100000 + Math.random() * 900000)}`,
    email: `customer${i + 1}@gmail.com`,
    totalOrders: (i % 8) + 1,
    spent: `${((i + 1) * 1250).toLocaleString('vi-VN')}0.000 đ`,
    status: i % 4 === 0 ? 'Lead' : i % 5 === 0 ? 'Inactive' : 'Active'
  }))
)

const filtered = computed(() => {
  if (!search.value) return customers.value
  return customers.value.filter(c =>
    Object.values(c).some(v => String(v).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Khách hàng</h1>
        <p class="text-sm text-gray-500">Quản lý thông tin và lịch sử giao dịch của khách hàng.</p>
      </div>
      <UButton icon="i-heroicons-user-plus" color="primary">Thêm khách hàng</UButton>
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Tìm tên, sđt, email..." class="max-w-xs" />
      </div>

      <UTable :data="filtered" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Active' ? 'success' : row.original.status === 'Lead' ? 'warning' : 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell>
          <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" size="xs" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>