<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui';
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// const title = 'Rey One'
// const description = 'SaaS'

// useSeoMeta({
//   title,
//   description,
//   ogTitle: title,
//   ogDescription: description,
// })

const toaster = { position: 'top-center' } satisfies ToasterProps
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLayout>
      <UMain>
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
