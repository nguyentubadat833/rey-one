<script setup lang="ts">
// 1. Stat cards summary
const stats = [
  {
    title: 'Tổng người dùng',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: 'i-heroicons-users',
    description: 'so với tháng trước'
  },
  {
    title: 'Dung lượng S3 đã dùng',
    value: '68.4 / 100 GB',
    change: '68%',
    trend: 'neutral',
    icon: 'i-heroicons-server',
    description: 'Gói Pro Business'
  },
  {
    title: 'Chi phí tháng này',
    value: '$49.00',
    change: 'Đã thanh toán',
    trend: 'up',
    icon: 'i-heroicons-banknotes',
    description: 'Hạn gia hạn: 31/12/2026'
  },
  {
    title: 'API Requests (30 ngày)',
    value: '845,210',
    change: '+8.2%',
    trend: 'up',
    icon: 'i-heroicons-cpu-chip',
    description: 'Hạn mức: 1M reqs'
  }
]

// 2. Resource usage breakdown
const resourceQuotas = [
  { name: 'S3 Storage (MinIO)', used: 68.4, total: 100, unit: 'GB', color: 'primary' },
  { name: 'Active Users', used: 18, total: 25, unit: 'Users', color: 'success' },
  { name: 'API Calls', used: 845210, total: 1000000, unit: 'Reqs', color: 'warning' },
  { name: 'Custom Domains', used: 3, total: 5, unit: 'Domains', color: 'neutral' }
]

// 3. Fake Data: Recent Activities Table (20+ records)
const activityColumns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'time', header: 'Thời gian' },
  { accessorKey: 'user', header: 'Thành viên' },
  { accessorKey: 'action', header: 'Hành động' },
  { accessorKey: 'module', header: 'Phân khu' },
  { accessorKey: 'status', header: 'Trạng thái' }
]

const userList = [
  'alex@company.com',
  'dev.lead@company.com',
  'admin@company.com',
  'support@client.com',
  'system_bot'
]
const actionList = [
  'Cập nhật Custom Domain',
  'Tạo API Key mới',
  'Đăng nhập hệ thống',
  'Xuất hóa đơn VAT',
  'Gửi email thông báo',
  'Thay đổi SMTP Server',
  'Nâng cấp gói cước'
]
const moduleList = ['IAM', 'Setting', 'Billing', 'Email Logs', 'Domains']
const statusList = ['Success', 'Success', 'Success', 'Warning', 'Failed']

const recentActivities = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: `ACT-${8000 + i}`,
    time: new Date(Date.now() - i * 1200000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    user: userList[i % userList.length],
    action: actionList[i % actionList.length],
    module: moduleList[i % moduleList.length],
    status: statusList[i % statusList.length]
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan Tenant Admin</h1>
        <p class="text-sm text-gray-500">Báo cáo hoạt động, tài nguyên và nhật ký hệ thống gần đây.</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="neutral" variant="outline" icon="i-heroicons-arrow-path">
          Làm mới
        </UButton>
        <UButton color="primary" icon="i-heroicons-plus">
          Mời thành viên
        </UButton>
      </div>
    </div>

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="stat in stats" :key="stat.title">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500">{{ stat.title }}</span>
          <UIcon :name="stat.icon" class="w-5 h-5 text-gray-400" />
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</span>
          <UBadge
            :color="stat.trend === 'up' ? 'success' : 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ stat.change }}
          </UBadge>
        </div>
        <p class="mt-1 text-xs text-gray-400">{{ stat.description }}</p>
      </UCard>
    </div>

    <!-- Main Grid: Resource Quotas & Quick Links -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Usage Quotas Overview (2 Cols) -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm">Hạn mức tài nguyên tiêu thụ</span>
            <NuxtLink to="/admin/usage" class="text-xs text-primary-500 hover:underline">
              Chi tiết →
            </NuxtLink>
          </div>
        </template>

        <div class="space-y-4">
          <div v-for="item in resourceQuotas" :key="item.name" class="space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.name }}</span>
              <span class="text-gray-400">
                {{ item.used.toLocaleString() }} / {{ item.total.toLocaleString() }} {{ item.unit }}
              </span>
            </div>
            <UProgress :model-value="Math.round((item.used / item.total) * 100)" :color="item.color as any" />
          </div>
        </div>
      </UCard>

      <!-- Quick Actions / Shortcuts (1 Col) -->
      <UCard>
        <template #header>
          <span class="font-semibold text-sm">Thao tác nhanh</span>
        </template>

        <div class="space-y-2">
          <UButton block color="neutral" variant="subtle" icon="i-heroicons-globe-alt" to="/admin/domains" class="justify-start">
            Cấu hình Custom Domain
          </UButton>
          <UButton block color="neutral" variant="subtle" icon="i-heroicons-key" to="/admin/setting" class="justify-start">
            Quản lý API Keys
          </UButton>
          <UButton block color="neutral" variant="subtle" icon="i-heroicons-swatch" to="/admin/branding" class="justify-start">
            Tùy biến White-label
          </UButton>
          <UButton block color="neutral" variant="subtle" icon="i-heroicons-credit-card" to="/admin/billing" class="justify-start">
            Tải hóa đơn mới nhất
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity Log Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <span class="font-semibold text-sm">Hoạt động hệ thống gần đây</span>
            <p class="text-xs text-gray-500">20 thao tác mới nhất được ghi lại từ Audit Logs</p>
          </div>
          <NuxtLink to="/admin/audit-logs" class="text-xs text-primary-500 hover:underline">
            Xem tất cả logs →
          </NuxtLink>
        </div>
      </template>

      <UTable :data="recentActivities" :columns="activityColumns">
        <template #module-cell="{ row }">
          <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
            {{ row.original.module }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="
              row.original.status === 'Success'
                ? 'success'
                : row.original.status === 'Warning'
                ? 'warning'
                : 'error'
            "
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