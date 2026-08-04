<script setup lang="ts">
import useUI from '~/composables/ui'
import type { MenuItem } from '~/types/ui-types';

const props = defineProps<{
  item: MenuItem
  collapsed?: boolean
  depth?: number
}>()

const route = useRoute()
const ui = useUI()
const depth = computed(() => props.depth ?? 0)

function isActive(path?: string) {
  if (!path) return false
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function hasActiveChild(item: MenuItem): boolean {
  return item.children?.some(child =>
    child.to ? isActive(child.to) : hasActiveChild(child)
  ) ?? false
}

function isExpanded(item: MenuItem) {
  return hasActiveChild(item) || ui.isMenuExpanded(`${depth.value}-${item.label}`)
}

function toggle(item: MenuItem) {
  if (hasActiveChild(item)) return
  ui.toggleMenu(`${depth.value}-${item.label}`)
}

const hoverNavItem = 'light:hover:bg-neutral-100 dark:hover:bg-neutral-700'

function beforeEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = '0'
  e.style.opacity = '0'
}

function enter(el: Element) {
  const e = el as HTMLElement
  e.style.transition = 'height .25s cubic-bezier(.4,0,.2,1), opacity .2s ease'
  const height = e.scrollHeight
  requestAnimationFrame(() => {
    e.style.height = `${height}px`
    e.style.opacity = '1'
  })
}

function afterEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = 'auto'
  e.style.transition = ''
}

function leave(el: Element) {
  const e = el as HTMLElement
  e.style.height = `${e.scrollHeight}px`
  e.style.opacity = '1'
  e.offsetHeight
  e.style.transition = 'height .22s cubic-bezier(.4,0,.2,1), opacity .15s ease'
  requestAnimationFrame(() => {
    e.style.height = '0'
    e.style.opacity = '0'
  })
}

function afterLeave(el: Element) {
  const e = el as HTMLElement
  e.style.transition = ''
}
</script>

<template>
  <!-- Có children → expandable -->
  <div v-if="!item.hidden">
    <div v-if="item.children">
      <button :class="[
        'flex w-full items-center justify-between rounded-xl px-4 py-3 transition',
        hoverNavItem,
      ]" :style="{ paddingLeft: `${(depth + 1) * 16}px` }" @click="toggle(item)">
        <div class="flex items-center gap-3">
          <UIcon :name="item.icon" class="text-lg shrink-0" />
          <span v-if="!collapsed">{{ item.label }}</span>
        </div>

        <UIcon v-if="!collapsed" name="i-lucide-chevron-right"
          :class="['transition-transform duration-200', isExpanded(item) && 'rotate-90']" />
      </button>

      <Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @leave="leave"
        @after-leave="afterLeave">
        <div v-if="isExpanded(item) && !collapsed" class="overflow-hidden">
          <!-- Đệ quy — gọi lại chính nó cho từng child -->
          <NavMenuItem v-for="child in item.children" :key="child.label" :item="child" :collapsed="collapsed"
            :depth="depth + 1" />
        </div>
      </Transition>
    </div>

    <!-- Không có children → RouterLink -->
    <RouterLink v-else :to="item.to!" :class="[
      'flex items-center gap-3 rounded-xl px-4 py-3 transition',
      isActive(item.to) ? 'bg-primary text-white' : hoverNavItem,
    ]" :style="{ paddingLeft: `${(depth + 1) * 16}px` }">
      <UIcon :name="item.icon" class="text-lg shrink-0" />
      <span v-if="!collapsed">{{ item.label }}</span>
    </RouterLink>
  </div>
</template>