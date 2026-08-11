<template>
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
    middleware: ['domain']
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
          },
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
</script>
