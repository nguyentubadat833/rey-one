<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'id', header: 'Mã Lead' },
  { accessorKey: 'fullName', header: 'Họ tên' },
  { accessorKey: 'contact', header: 'Liên hệ' },
  { accessorKey: 'source', header: 'Nguồn Lead' },
  { accessorKey: 'assignedTo', header: 'Sales phụ trách' },
  { accessorKey: 'score', header: 'Điểm tiềm năng' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const sources = ['Website Form', 'Facebook Ads', 'Google Search', 'Giới thiệu', 'Event/Workshop']
const salesList = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D']
const statuses = ['New', 'Contacted', 'Qualified', 'Unqualified']

const leads = ref(
  Array.from({ length: 22 }, (_, i) => ({
    id: `LEAD-${5000 + i}`,
    fullName: `Khách tiềm năng ${i + 1}`,
    contact: `0905${Math.floor(100000 + Math.random() * 900000)} | lead${i + 1}@gmail.com`,
    source: sources[i % sources.length],
    assignedTo: salesList[i % salesList.length],
    score: `${Math.floor(40 + Math.random() * 55)}/100`,
    status: statuses[i % statuses.length]
  }))
)

const filteredLeads = computed(() => {
  if (!search.value) return leads.value
  return leads.value.filter(l =>
    Object.values(l).some(v => String(v).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Khách hàng Tiềm năng (Leads)</h1>
        <p class="text-sm text-gray-500">Tiếp nhận và phân loại data khách hàng thô từ các kênh Marketing.</p>
      </div>
      <UButton icon="i-heroicons-funnel" color="primary">Thêm Lead mới</UButton>
    </div>

    <UCard>
      <div class="mb-4 flex justify-between items-center">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Tìm tên, số điện thoại..." class="max-w-xs" />
        <span class="text-xs text-gray-400">Tổng cộng {{ filteredLeads.length }} Leads</span>
      </div>

      <UTable :data="filteredLeads" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="
              row.original.status === 'New'
                ? 'primary'
                : row.original.status === 'Qualified'
                ? 'success'
                : row.original.status === 'Contacted'
                ? 'warning'
                : 'neutral'
            "
            variant="subtle"
            size="xs"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
        <template #actions-cell>
          <div class="flex gap-1">
            <UButton icon="i-heroicons-arrow-path-rounded-square" color="success" variant="ghost" size="xs" title="Chuyển thành Customer" />
            <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" size="xs" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>