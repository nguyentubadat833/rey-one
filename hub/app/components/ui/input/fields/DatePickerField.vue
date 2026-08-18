<script setup lang="ts">
import {
  parseDate,
} from '@internationalized/date'

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Date',
  },
)

const inputDate = useTemplateRef('inputDate')

const date = defineModel<string | undefined>('date', {
  required: true,
})

const modelValue = computed({
  get() {
    return date.value ? parseDate(date.value) : undefined
  },

  set(value) {
    date.value = value?.toString()
  },
})
</script>

<template>
  <UFormField :label="label">
    <UInputDate ref="inputDate" v-model="modelValue">
      <template #trailing>
        <UPopover :reference="inputDate?.inputsRef[3]?.$el">
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-calendar"
            aria-label="Select a date"
            class="px-0"
          />

          <template #content>
            <UCalendar v-model="modelValue" class="p-2" />
          </template>
        </UPopover>
      </template>
    </UInputDate>
  </UFormField>
</template>