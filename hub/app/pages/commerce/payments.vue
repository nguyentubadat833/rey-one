<script setup lang="ts">
const columns = [
  { accessorKey: 'transId', header: 'Mã GD' },
  { accessorKey: 'orderCode', header: 'Mã đơn' },
  { accessorKey: 'method', header: 'Cổng thanh toán' },
  { accessorKey: 'amount', header: 'Số tiền' },
  { accessorKey: 'time', header: 'Thời gian' },
  { accessorKey: 'status', header: 'Trạng thái' }
]

const methods = ['Chuyển khoản (VNPay)', 'MOMO', 'PayPal', 'Thẻ VISA/Mastercard']
const payments = ref(
  Array.from({ length: 20 }, (_, i) => ({
    transId: `TRX-${9000 + i}`,
    orderCode: `ORD-${202600 + i}`,
    method: methods[i % methods.length],
    amount: `${((i + 1) * 450).toLocaleString('vi-VN')}.000 đ`,
    time: new Date(Date.now() - i * 3600000).toLocaleString('vi-VN'),
    status: i % 5 === 0 ? 'Thất bại' : 'Thành công'
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử Thanh toán</h1>
      <p class="text-sm text-gray-500">Nhật ký giao dịch qua các cổng thanh toán tích hợp.</p>
    </div>

    <UCard>
      <UTable :data="payments" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Thành công' ? 'success' : 'error'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>