<script setup lang="ts">
const search = ref('')
const selectedStatus = ref('All')
const isDetailOpen = ref(false)
const selectedLog = ref<any>(null)

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'sentAt', header: 'Thời gian' },
  { accessorKey: 'recipient', header: 'Người nhận' },
  { accessorKey: 'subject', header: 'Tiêu đề Email' },
  { accessorKey: 'type', header: 'Loại Mail' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const mailTypes = ['AUTHENTICATION', 'BILLING_INVOICE', 'SYSTEM_ALERT', 'NOTIFICATION', 'PASSWORD_RESET']
const statuses = ['DELIVERED', 'FAILED', 'BOUNCED', 'PENDING']
const recipients = ['user.demo@gmail.com', 'admin@company.com', 'billing@partner.io', 'tech.lead@startup.vn', 'support@client.com']
const subjects = [
  'Xác thực đăng nhập thiết bị mới',
  'Hóa đơn thanh toán dịch vụ #INV-2026-102',
  'Cảnh báo: Dung lượng lưu trữ S3 vượt 80%',
  'Thong bao gia han goi Pro Business',
  'Yêu cầu khôi phục mật khẩu tài khoản'
]

// Fake 25+ records dữ liệu lịch sử gửi mail của Tenant
const emailLogs = ref(
  Array.from({ length: 25 }, (_, i) => {
    const status = statuses[i % statuses.length]
    return {
      id: `MAIL-${10000 + i}`,
      sentAt: new Date(Date.now() - i * 1800000).toLocaleString('vi-VN'),
      recipient: recipients[i % recipients.length],
      subject: subjects[i % subjects.length],
      type: mailTypes[i % mailTypes.length],
      status: status,
      sender: 'no-reply@rone-system.com',
      errorMessage: status === 'FAILED' ? '550 5.1.1 The email account that you tried to reach does not exist.' : status === 'BOUNCED' ? 'Mailbox full / Quota exceeded' : null
    }
  })
)

// Tính toán chỉ số thống kê
const stats = computed(() => {
  const total = emailLogs.value.length
  const delivered = emailLogs.value.filter(l => l.status === 'DELIVERED').length
  const failed = emailLogs.value.filter(l => l.status === 'FAILED' || l.status === 'BOUNCED').length
  return { total, delivered, failed, rate: Math.round((delivered / total) * 100) }
})

// Lọc dữ liệu
const filteredLogs = computed(() => {
  return emailLogs.value.filter(log => {
    const matchSearch = Object.values(log).some(val => 
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
    const matchStatus = selectedStatus.value === 'All' || log.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const viewDetail = (log: any) => {
  selectedLog.value = log
  isDetailOpen.value = true
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử gửi Email</h1>
        <p class="text-sm text-gray-500">Theo dõi nhật ký và trạng thái phân phối email trên toàn ứng dụng.</p>
      </div>
      <UButton icon="i-heroicons-arrow-path" color="neutral" variant="outline">
        Làm mới
      </UButton>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <UCard>
        <p class="text-xs text-gray-500 font-medium">Tổng số email gửi</p>
        <p class="text-2xl font-bold mt-1">{{ stats.total }}</p>
      </UCard>
      <UCard>
        <p class="text-xs text-gray-500 font-medium">Thành công (Delivered)</p>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.delivered }}</p>
      </UCard>
      <UCard>
        <p class="text-xs text-gray-500 font-medium">Thất bại / Bounced</p>
        <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{{ stats.failed }}</p>
      </UCard>
      <UCard>
        <p class="text-xs text-gray-500 font-medium">Tỷ lệ thành công</p>
        <p class="text-2xl font-bold text-primary-500 mt-1">{{ stats.rate }}%</p>
      </UCard>
    </div>

    <!-- Filters & Main Table -->
    <UCard>
      <template #header>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Tìm theo email, tiêu đề, ID..."
              class="max-w-xs"
            />
            <USelect
              v-model="selectedStatus"
              :items="['All', 'DELIVERED', 'FAILED', 'BOUNCED', 'PENDING']"
              class="w-36"
            />
          </div>
          <span class="text-xs text-gray-400">Hiển thị {{ filteredLogs.length }} kết quả</span>
        </div>
      </template>

      <UTable :data="filteredLogs" :columns="columns">
        <template #type-cell="{ row }">
          <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
            {{ row.original.type }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="
              row.original.status === 'DELIVERED'
                ? 'success'
                : row.original.status === 'FAILED'
                ? 'error'
                : row.original.status === 'BOUNCED'
                ? 'warning'
                : 'neutral'
            "
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-heroicons-eye"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="viewDetail(row.original)"
          />
        </template>
      </UTable>
    </UCard>

    <!-- Email Detail Drawer/Slideover -->
    <USlideover v-model:open="isDetailOpen" title="Chi tiết nhật ký Email">
      <template #body>
        <div v-if="selectedLog" class="space-y-4 text-sm">
          <div>
            <span class="text-xs text-gray-500 block">Mã giao dịch (ID)</span>
            <span class="font-mono font-medium">{{ selectedLog.id }}</span>
          </div>

          <USeparator />

          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="text-xs text-gray-500 block">Trạng thái</span>
              <UBadge
                :color="selectedLog.status === 'DELIVERED' ? 'success' : 'error'"
                variant="subtle"
                size="xs"
              >
                {{ selectedLog.status }}
              </UBadge>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Thời gian gửi</span>
              <span>{{ selectedLog.sentAt }}</span>
            </div>
          </div>

          <div>
            <span class="text-xs text-gray-500 block">Người gửi (From)</span>
            <span class="font-medium">{{ selectedLog.sender }}</span>
          </div>

          <div>
            <span class="text-xs text-gray-500 block">Người nhận (To)</span>
            <span class="font-medium text-primary-600 dark:text-primary-400">{{ selectedLog.recipient }}</span>
          </div>

          <div>
            <span class="text-xs text-gray-500 block">Tiêu đề (Subject)</span>
            <span class="font-semibold">{{ selectedLog.subject }}</span>
          </div>

          <!-- Hiển thị lỗi nếu gửi thất bại -->
          <div v-if="selectedLog.errorMessage" class="p-3 bg-red-500/10 border border-red-500/20 rounded-md space-y-1">
            <span class="text-xs font-bold text-red-600 dark:text-red-400">Chi tiết lỗi SMTP / Delivery Error:</span>
            <p class="font-mono text-xs text-red-500 leading-relaxed">{{ selectedLog.errorMessage }}</p>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>