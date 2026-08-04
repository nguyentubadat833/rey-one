// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/device', '@vueuse/nuxt'],

  ssr: false,

  devServer: {
    port: 4008
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/**': { ssr: false },

    '/rmk-api/**': {
      proxy: {
        to: `${process.env.NUXT_API_URL}/rmk-api/**`
      }
    }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})