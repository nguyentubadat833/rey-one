<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'timestamp', header: 'Thời gian' },
  { accessorKey: 'actor', header: 'Người thực hiện' },
  { accessorKey: 'action', header: 'Hành động' },
  { accessorKey: 'resource', header: 'Tài nguyên' },
  { accessorKey: 'ipAddress', header: 'IP Address' },
  { accessorKey: 'status', header: 'Trạng thái' }
]

const actions = ['USER_LOGIN', 'USER_LOGOUT', 'UPDATE_DOMAIN', 'DELETE_USER', 'CREATE_ROLE', 'EXPORT_DATA', 'CHANGE_PASSWORD']
const statusList = ['Success', 'Failed', 'Warning']
const users = ['alex@company.com', 'dev.lead@company.com', 'admin@company.com', 'system_bot', 'support@company.com']

const logs = ref(
  Array.from({ length: 25 }, (_, i) => ({
    id: `LOG-${1000 + i}`,
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString('vi-VN'),
    actor: users[i % users.length],
    action: actions[i % actions.length],
    resource: `/api/v1/resource/${(i % 10) + 1}`,
    ipAddress: `192.168.1.${(i * 7) % 255}`,
    status: statusList[i % statusList.length]
  }))
)

const filteredLogs = computed(() => {
  if (!search.value) return logs.value
  return logs.value.filter(log =>
    Object.values(log).some(val => String(val).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit & Security Logs</h1>
        <p class="text-sm text-gray-500">Nhật ký thao tác và bảo mật toàn hệ thống.</p>
      </div>
      <UButton icon="i-heroicons-arrow-down-tray" color="neutral" variant="outline">
        Export CSV
      </UButton>
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Tìm kiếm log..." class="max-w-sm" />
      </div>

      <UTable :data="filteredLogs" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Success' ? 'success' : row.original.status === 'Failed' ? 'error' : 'warning'"
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #action-cell="{ row }">
          <span class="font-mono text-xs font-semibold">{{ row.original.action }}</span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>