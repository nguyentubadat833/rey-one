<template>
  <div class="flex gap-2 items-center">
    <UIcon name="glyphs-poly:grid-add" class="size-8" />
    <p v-if="showName" class="font-bold">RONE SYSTEM</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
   showName?: boolean
}>()
</script>
