<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error?.status === 404)

const title = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong'
)

const description = computed(() =>
  isNotFound.value
    ? "The page you're looking for doesn't exist or has been moved."
    : props.error?.message || 'The system ran into an issue. Please try again in a moment.'
)

function handleRetry() {
  clearError({ redirect: '/' })
}

function handleGoBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__grid" aria-hidden="true" />

    <div class="error-page__content">
      <div class="error-page__code">
        <span
          v-for="(digit, i) in String(error?.status ?? 500)"
          :key="i"
          class="error-page__digit"
          :style="{ animationDelay: `${i * 80}ms` }"
        >{{ digit }}</span>
      </div>

      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__description">{{ description }}</p>

      <div class="error-page__actions">
        <UButton
          size="lg"
          color="primary"
          icon="i-lucide-house"
          @click="handleRetry"
        >
          Back to home
        </UButton>
        <UButton
          size="lg"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          @click="handleGoBack"
        >
          Go back
        </UButton>
      </div>

      <details v-if="error?.stack" class="error-page__stack">
        <summary>Technical details</summary>
        <pre>{{ error.stack }}</pre>
      </details>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  background: radial-gradient(circle at 20% 20%, #14183a 0%, #0a0c1c 55%, #050611 100%);
  color: #e7e9f7;
}

.error-page__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(140, 150, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(140, 150, 255, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
}

.error-page__content {
  position: relative;
  z-index: 1;
  max-width: 34rem;
  width: 100%;
  text-align: center;
}

.error-page__code {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: clamp(4.5rem, 14vw, 8rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #a5b4ff 0%, #6d7bff 45%, #3d3fa8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-flex;
  gap: 0.05em;
}

.error-page__digit {
  display: inline-block;
  animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0.4em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-page__title {
  margin-top: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f4f5fd;
}

.error-page__description {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #9aa0c3;
  line-height: 1.6;
}

.error-page__actions {
  margin-top: 2rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-page__stack {
  margin-top: 2.5rem;
  text-align: left;
  border: 1px solid rgba(140, 150, 255, 0.15);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(140, 150, 255, 0.04);
}

.error-page__stack summary {
  cursor: pointer;
  font-size: 0.8rem;
  color: #9aa0c3;
  user-select: none;
}

.error-page__stack pre {
  margin-top: 0.75rem;
  font-size: 0.7rem;
  line-height: 1.5;
  color: #6d7bff;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 16rem;
  overflow-y: auto;
}

@media (prefers-reduced-motion: reduce) {
  .error-page__digit {
    animation: none;
  }
}
</style>