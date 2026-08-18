<script setup lang="ts">
const columns = [
  { accessorKey: 'code', header: 'Mã NCC' },
  { accessorKey: 'name', header: 'Tên nhà cung cấp / Đối tác' },
  { accessorKey: 'contactPerson', header: 'Người đại diện' },
  { accessorKey: 'phone', header: 'Số điện thoại' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'totalProducts', header: 'Sản phẩm cung cấp' },
  { accessorKey: 'actions', header: '' }
]

const suppliers = ref([
  { code: 'SUP-01', name: 'Công ty Cổ phần Công nghệ AWS', contactPerson: 'Nguyễn Văn Hải', phone: '0901234567', email: 'hai.nguyen@aws-partner.vn', totalProducts: 12 },
  { code: 'SUP-02', name: 'Tập đoàn Giải pháp Cloud Remika', contactPerson: 'Trần Thị Mai', phone: '0912345678', email: 'mai.tran@remika.vn', totalProducts: 8 },
  { code: 'SUP-03', name: 'Nhà phân phối Phần mềm BKNET', contactPerson: 'Lê Hoàng Long', phone: '0987654321', email: 'contact@bknet.vn', totalProducts: 15 },
  { code: 'SUP-04', name: 'Công ty TNHH Thiết bị Số 1', contactPerson: 'Phạm Minh Tuấn', phone: '0933445566', email: 'tuan.pm@thietbiso1.com', totalProducts: 5 }
])
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Thương hiệu & Nhà cung cấp</h1>
        <p class="text-sm text-gray-500">Quản lý các đơn vị ứng dụng/phần cứng đối tác nhập hàng.</p>
      </div>
      <UButton icon="i-heroicons-building-office-2" color="primary">Thêm nhà cung cấp</UButton>
    </div>

    <UCard>
      <UTable :data="suppliers" :columns="columns">
        <template #actions-cell>
          <div class="flex gap-1">
            <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" size="xs" />
            <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="xs" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>