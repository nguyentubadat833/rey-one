<script setup lang="ts">
const quotas = [
  { name: 'S3 Storage (MinIO)', used: 68.4, total: 100, unit: 'GB', color: 'primary' },
  { name: 'Active Users', used: 18, total: 25, unit: 'Users', color: 'success' },
  { name: 'API Requests (Tháng này)', used: 845000, total: 1000000, unit: 'Requests', color: 'warning' },
  { name: 'Custom Domains', used: 3, total: 5, unit: 'Domains', color: 'neutral' }
]
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sử dụng & Hạn mức</h1>
      <p class="text-sm text-gray-500">Mức tài nguyên đang tiêu thụ so với hạn mức gói dịch vụ.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard v-for="item in quotas" :key="item.name">
        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold text-gray-700 dark:text-gray-200">{{ item.name }}</span>
            <span class="text-xs text-gray-500">
              {{ item.used.toLocaleString() }} / {{ item.total.toLocaleString() }} {{ item.unit }}
            </span>
          </div>

          <UProgress :model-value="Math.round((item.used / item.total) * 100)" :color="item.color as any" />

          <div class="flex justify-between text-xs text-gray-400">
            <span>Đã dùng {{ Math.round((item.used / item.total) * 100) }}%</span>
            <span>Còn lại {{ (item.total - item.used).toLocaleString() }} {{ item.unit }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>