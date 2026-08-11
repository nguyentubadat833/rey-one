<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: string | undefined
}>()

const copied = ref(false)

async function copy() {
  if (!props.modelValue) return

  await navigator.clipboard.writeText(props.modelValue)

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <UFormField :label="label ?? 'ID'">
    <UInput
      disabled
      :model-value="modelValue"
      :ui="{ trailing: 'pr-0.5' }"
      class="w-full"
    >
      <template #trailing>
        <UTooltip
          text="Copy to clipboard"
          :content="{ side: 'right' }"
        >
          <UButton
            :color="copied ? 'success' : 'neutral'"
            variant="link"
            size="sm"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            aria-label="Copy to clipboard"
            @click="copy"
          />
        </UTooltip>
      </template>
    </UInput>
  </UFormField>
</template>