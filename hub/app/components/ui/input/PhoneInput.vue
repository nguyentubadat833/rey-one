<script setup lang="ts">
import { vMaska } from 'maska/vue'

const phone = defineModel<string>()

type PhoneCode = {
    name: string
    code: string
    emoji: string
    dialCode: string
    mask: string
}

const phoneCodes: PhoneCode[] = [
  {
    name: 'United States',
    code: 'US',
    emoji: '🇺🇸',
    dialCode: '+1',
    mask: '(###) ###-####',
  },
  {
    name: 'Vietnam',
    code: 'VN',
    emoji: '🇻🇳',
    dialCode: '+84',
    mask: '#### ### ###',
  },
]

const countryCode = ref('VN')

// const { data: phoneCodes, status, execute } = await useLazyFetch<PhoneCode[]>('/api/phone-codes.json', {
//   key: 'api-phone-codes',
//   immediate: false
// })

const country = computed(() => phoneCodes.find(c => c.code === countryCode.value))
const dialCode = computed(() => country.value?.dialCode || '+1')
const mask = computed(() => country.value?.mask || '(###) ###-####')

// function onOpen() {
//     if (!phoneCodes.value?.length) {
//         execute()
//     }
// }

watch(countryCode, () => {
    phone.value = ''
})
</script>

<template>
    <UFieldGroup>
        <USelectMenu v-model="countryCode" :items="phoneCodes" value-key="code" :search-input="{
            placeholder: 'Search country...',
            icon: 'i-lucide-search',
        }" :filter-fields="['name', 'code', 'dialCode']" :content="{ align: 'start' }" :ui="{
            base: 'pe-8',
            content: 'w-48',
            placeholder: 'hidden',
            trailingIcon: 'size-4'
        }" trailing-icon="i-lucide-chevrons-up-down">
            <span class="size-5 flex items-center text-lg">
                {{ country?.emoji || '\u{1F1FA}\u{1F1F8}' }}
            </span>

            <template #item-leading="{ item }">
                <span class="size-5 flex items-center text-lg">
                    {{ item.emoji }}
                </span>
            </template>

            <template #item-label="{ item }">
                {{ item.name }} ({{ item.dialCode }})
            </template>
        </USelectMenu>

        <UInput v-model="phone" v-maska="mask" :placeholder="mask.replaceAll('#', '_')"
            :style="{ '--dial-code-length': `${dialCode.length + 1.5}ch` }" :ui="{
                base: 'ps-(--dial-code-length)',
                leading: 'pointer-events-none text-base md:text-sm text-muted'
            }">
            <template #leading>
                {{ dialCode }}
            </template>
        </UInput>
    </UFieldGroup>
</template>
