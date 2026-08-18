<script setup lang="ts">
const stages = [
  { id: 'new', name: 'Mới tiếp cận', color: 'border-blue-500' },
  { id: 'qualification', name: 'Tư vấn / Đánh giá', color: 'border-yellow-500' },
  { id: 'proposal', name: 'Gửi báo giá / Demo', color: 'border-purple-500' },
  { id: 'negotiation', name: 'Đàm phán hợp đồng', color: 'border-orange-500' },
  { id: 'won', name: 'Chốt đơn thành công', color: 'border-green-500' }
]

const deals = ref([
  { id: 'D-101', title: 'Hợp đồng ERP Remika - Cty Á Đông', value: '150,000,000 đ', customer: 'Cty Á Đông', stage: 'proposal' },
  { id: 'D-102', title: 'Gói SaaS Enterprise - Tập đoàn X', value: '450,000,000 đ', customer: 'Tập đoàn X', stage: 'negotiation' },
  { id: 'D-103', title: 'Triển khai CRM cho Chuỗi Spa H', value: '85,000,000 đ', customer: 'Chuỗi Spa H', stage: 'new' },
  { id: 'D-104', title: 'Nâng cấp hệ thống Cloud - Cty Y', value: '120,000,000 đ', customer: 'Cty Y', stage: 'qualification' },
  { id: 'D-105', title: 'Bản quyền phần mềm 1 năm - Cty Z', value: '45,000,000 đ', customer: 'Cty Z', stage: 'won' },
  { id: 'D-106', title: 'Tích hợp thanh toán API - TechCorp', value: '210,000,000 đ', customer: 'TechCorp', stage: 'proposal' },
  { id: 'D-107', title: 'Đào tạo nhân sự sử dụng - Cty K', value: '30,000,000 đ', customer: 'Cty K', stage: 'new' },
  { id: 'D-108', title: 'Gói chăm sóc khách hàng - Retail Group', value: '320,000,000 đ', customer: 'Retail Group', stage: 'won' }
])

const getDealsByStage = (stageId: string) => deals.value.filter(d => d.stage === stageId)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cơ hội bán hàng (Deals Pipeline)</h1>
        <p class="text-sm text-gray-500">Quản lý và dự báo doanh số theo từng giai đoạn đàm phán.</p>
      </div>
      <UButton icon="i-heroicons-currency-dollar" color="primary">Tạo Deal mới</UButton>
    </div>

    <!-- Kanban Board Grid -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border-t-4 min-w-[220px]"
        :class="stage.color"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ stage.name }}</span>
          <UBadge color="neutral" variant="subtle" size="xs">
            {{ getDealsByStage(stage.id).length }}
          </UBadge>
        </div>

        <div class="space-y-3">
          <UCard
            v-for="deal in getDealsByStage(stage.id)"
            :key="deal.id"
            class="cursor-pointer hover:shadow-md transition-shadow"
          >
            <div class="space-y-2">
              <span class="text-xs font-mono text-gray-400 block">{{ deal.id }}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">{{ deal.title }}</h4>
              <p class="text-xs text-gray-500">{{ deal.customer }}</p>
              <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span class="font-bold text-xs text-primary-600 dark:text-primary-400">{{ deal.value }}</span>
                <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>