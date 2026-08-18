<!-- <template>
  <div class="flex flex-col">
    <div class="flex justify-between px-4 py-3.5 border-b border-accented">
      <TableGlobalSearch />
      <div class="flex items-center gap-4">
        <RefreshButton @click="refresh" :loading="pending" />
        <component :is="ProductButton()" />
      </div>
    </div>

    <UTable
      ref="usersTable"
      :columns="columns"
      :data="data"
      v-model:global-filter="searchInput"
      :loading="pending"
      loading-color="primary"
      loading-animation="carousel"
      sticky
      class="flex-1 overflow-auto"
    >
      <template #no-cell="{ row }">{{ row.index + 1 }}</template>
      <template #actions-cell="{ row }">
        <component :is="ProductButton(row.original)" />
      </template>
    </UTable>

    <Pagination v-model:data="paginationQuery" />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { ProductSummaryView } from "@rey-one/shared";
import useProductForm from "~/components/product/composables/useProductForm";
import ProductForm from "~/components/product/ProductForm.vue";
import CreateButton from "~/components/ui/button/CreateButton.vue";
import EditButton from "~/components/ui/button/EditButton.vue";
import RefreshButton from "~/components/ui/button/RefreshButton.vue";
import SaveButton from "~/components/ui/button/SaveButton.vue";
import Pagination from "~/components/ui/Pagination.vue";
import { createPaginationQuery } from "~/composables/api/pagination-query";

definePageMeta({
    title: "Product management",
    middleware: ['domain-user']
})

const Modal = resolveComponent("UModal");

const columns = [
  { id: "no" },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "currency", header: "Currency" },
  { accessorKey: "defaultCost", header: "Cost" },
  { accessorKey: "status", header: "Status" },
  { id: "actions" },
] satisfies TableColumn<ProductSummaryView>[];

const paginationQuery = createPaginationQuery<ProductSummaryView>(
  "/products",
  5,
);

const { fetch, data } = paginationQuery;
const { searchInput, TableGlobalSearch } = createTableGlobalFilter();
const { productFormState, resetForm, save, loadProduct } = useProductForm();

const { pending, refresh } = await fetch();

function ProductButton(product?: ProductSummaryView) {
  const isAdd = !product;

  return h(
    Modal,
    {
      title: isAdd ? "*New Product" : productFormState.data.name,
    },
    {
      default: () =>
        h(isAdd ? CreateButton : EditButton, {
          onClick: async () => {
            resetForm();
            if (!isAdd) {
              await loadProduct(product.id);
            }
          },Q
        }),
      body: () => h(ProductForm),
      footer: () =>
        h("div", { class: "flex justify-end gap-3 w-full" }, [
          h(SaveButton, {
            loading: productFormState.loading,
            onClick: () => save().then(() => refresh()),
          }),
        ]),
    },
  );
}
</script> -->

<script setup lang="ts">
const search = ref('')

const columns = [
  { accessorKey: 'sku', header: 'Mã SKU' },
  { accessorKey: 'name', header: 'Tên sản phẩm' },
  { accessorKey: 'category', header: 'Danh mục' },
  { accessorKey: 'price', header: 'Giá bán' },
  { accessorKey: 'stock', header: 'Tồn kho' },
  { accessorKey: 'status', header: 'Trạng thái' },
  { accessorKey: 'actions', header: '' }
]

const categories = ['Khóa học Online', 'Phần mềm', 'Thiết bị', 'Dịch vụ']
const products = ref(
  Array.from({ length: 20 }, (_, i) => ({
    sku: `SKU-${200 + i}`,
    name: `Sản phẩm dịch vụ mẫu #${i + 1}`,
    category: categories[i % categories.length],
    price: `${((i + 1) * 350).toLocaleString('vi-VN')}.000 đ`,
    stock: i % 3 === 0 ? 0 : (i + 1) * 15,
    status: i % 3 === 0 ? 'Hết hàng' : 'Đang bán'
  }))
)

const filtered = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    Object.values(p).some(v => String(v).toLowerCase().includes(search.value.toLowerCase()))
  )
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Sản phẩm</h1>
        <p class="text-sm text-gray-500">Danh mục sản phẩm và gói dịch vụ kinh doanh.</p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary">Thêm sản phẩm</UButton>
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Tìm tên sản phẩm, SKU..." class="max-w-xs" />
      </div>

      <UTable :data="filtered" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Đang bán' ? 'success' : 'error'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.status }}
          </UBadge>
        </template>
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
