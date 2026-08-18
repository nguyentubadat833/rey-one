<template>
  <form class="space-y-5">
    <CopyableField :model-value="domainFormState.data.id" />
    <NameField v-model:name="domainFormState.data.name" placeholder="e.g. Acme Corporation" />
    <EmailField :disabled="isDisabledField" v-model:email="email" />
    <DomainStatusField v-model:status="domainFormState.data.status" />
    <DomainPlanField :disabled="isDisabledField" v-model:plan="domainFormState.data.plan" />
    <div class="flex gap-2 w-ful">
      <DatePickerField :disabled="isDisabledField" label="Started at" v-model:date="domainFormState.data.startedAt" />
      <DatePickerField label="Expires at" v-model:date="domainFormState.data.expiresAt" />
    </div>
    <UFormField label="Permissions">
      <UTable :data="domainFormState.permissionChecks" sticky class="max-h-[50vh]">
        <template #active-cell="{ row }">
          <UCheckbox v-model="row.original.active" />
        </template>
      </UTable>
    </UFormField>
  </form>
</template>
<script setup lang="ts">
import CopyableField from "../ui/input/fields/CopyableField.vue";
import DatePickerField from "../ui/input/fields/DatePickerField.vue";
import DomainPlanField from "../ui/input/fields/DomainPlanField.vue";
import DomainStatusField from "../ui/input/fields/DomainStatusField.vue";
import EmailField from "../ui/input/fields/EmailField.vue";
import NameField from "../ui/input/fields/NameField.vue";
import useDomainForm from "./composables/useDomainForm";

const { domainFormState } = useDomainForm();

const email = computed({
  set: (value) => {
    domainFormState.data.owner = {
      email: value,
      status: 'pending'
    }
  },
  get: () => domainFormState.data.owner?.email ?? ''
})

const isDisabledField = computed(() => !!domainFormState.data.id)
</script>
