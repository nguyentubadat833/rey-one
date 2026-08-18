<script setup lang="ts">
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  toCalendarDate
} from '@internationalized/date'

withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    label: 'Date',
    disabled: false
  },
)

const timeZone = getLocalTimeZone()
const inputDate = useTemplateRef('inputDate')

const date = defineModel<string | undefined>('date', {
  required: true,
})

// const modelValue = shallowRef<CalendarDate>()

const modelValue = computed({
  get() {
    return date.value ? toCalendarDate(parseAbsoluteToLocal(date.value)) : undefined
  },

  set(value) {
    date.value = value?.toDate(timeZone).toISOString()
  },
})

</script>

<template>
  <UFormField :label="label">
    <UInputDate :disabled="disabled" ref="inputDate" v-model="modelValue">
      <template #trailing>
        <UPopover :reference="inputDate?.inputsRef[3]?.$el">
          <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar" aria-label="Select a date"
            class="px-0" />

          <template #content>
            <UCalendar v-model="modelValue" class="p-2" />
          </template>
        </UPopover>
      </template>
    </UInputDate>
  </UFormField>
</template>