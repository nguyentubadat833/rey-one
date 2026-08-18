<template>
  <div class="space-y-5">
    <div class="flex justify-between px-4 py-3.5 border-b border-accented">
      <TableGlobalSearch />
      <div class="flex items-center gap-4">
        <RefreshButton @click="refresh" :loading="pending" />
        <component :is="MemberButton()" v-model:open="open" />
      </div>
    </div>

    <UTable
      :data="members"
      :columns="memberColumns"
      v-model:global-filter="searchInput"
      :loading="pending"
      loading-color="primary"
      loading-animation="carousel"
    >
      <template #no-cell="{ row }">
        {{ row.index + 1 }}
      </template>
      <template #actions-cell="{ row }">
        <component :is="MemberButton(row.original)" />
      </template>
    </UTable>

    <Pagination :data="paginationQuery" />
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type z from "zod";
import type {
  ApiResponse,
  DomainSchema,
  DomainUserSchema,
} from "@rey-one/shared";
import { createPaginationQuery } from "~/composables/api/pagination-query";
import { permission } from "#imports";
import RefreshButton from "~/components/ui/button/RefreshButton.vue";
import Pagination from "~/components/ui/Pagination.vue";
import CreateButton from "~/components/ui/button/CreateButton.vue";
import EditButton from "~/components/ui/button/EditButton.vue";
import SaveButton from "~/components/ui/button/SaveButton.vue";
import useUserForm from "~/components/user/composables/useUserForm";
import UserForm from "~/components/user/UserForm.vue";
import { useAPI } from "~/composables/api";

type Domain = z.infer<typeof DomainSchema>;
type DomainMember = z.infer<typeof DomainUserSchema>;

definePageMeta({
  title: "Members Management",
  middleware: ["domain-user"],
});

defineShortcuts({
  escape: {
    handler: () => {
      open.value = false;
    },
  },
  enter: {
    handler: () => submit(),
  },
});

const memberColumns = [
  { id: "no" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "phone", header: "Phone" },
  { id: "actions" },
] satisfies TableColumn<DomainMember>[];

const paginationQuery = createPaginationQuery<DomainMember>(
  "/domains/members",
  5,
);
const { searchInput, TableGlobalSearch } = createTableGlobalFilter();
const { resetFormData, userFormState, save, loadFormData } = useUserForm();
const { fetch, data: members } = paginationQuery;
const { createPermissionsChecks } = permission();

const { refresh, pending } = await fetch();
const open = ref(false);

const Modal = resolveComponent("UModal");

  const { data: myDomainInfo, execute: loadMyDomain } = useLazyAsyncData(
    () => {
      return useAPI<ApiResponse<Domain>>("/domains/info");
    },
    {
      immediate: false
    },
  );

const submit = () =>
  save().then(() => {
    refresh();
  });

const MemberButton = (row?: DomainMember) => {
  const isAdd = !row;
  return h(
    Modal,
    {
      title: isAdd ? "*New member" : row.name,
    },
    {
      default: () =>
        h(isAdd ? CreateButton : EditButton, {
          onClick: async () => {
            resetFormData();

            userFormState.type = "domainUser";
            if (!myDomainInfo.value?.data) {
              await loadMyDomain();
              userFormState.referencePermissions =
                myDomainInfo.value?.data.permissions ?? [];
            }

            if (row) {
              await loadFormData(row.id);
            }

            userFormState.permissionChecks = createPermissionsChecks({
              currentPermissions: userFormState.data.permissions,
              referencePermissions: userFormState.referencePermissions,
            });
          },
        }),
      body: () => h(UserForm),
      footer: () =>
        h("div", { class: "flex justify-end gap-3 w-full" }, [
          h(SaveButton, {
            loading: userFormState.loading,
            onClick: submit,
          }),
        ]),
    },
  );
};
</script>
