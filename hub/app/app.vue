<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'RONE'
const description = 'An all-in-one platform for managing content, digital products, courses, users, and online payments.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const toaster = { position: 'top-center' } satisfies ToasterProps

</script>
  
<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <UMain>
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
