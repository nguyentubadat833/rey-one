<template>
    <UModal :title="title">
        <slot name="icon"></slot>
        <UButton v-if="!$slots.icon" icon="ic:baseline-checklist" color="neutral" variant="subtle" />

        <template #body>
            <form class="space-y-5">
                <UFormField label="ID">
                    <UInput disabled v-model="state.id" class="w-full" />
                </UFormField>
                <UFormField label="Name">
                    <UInput v-model="state.name" class="w-full" />
                </UFormField>
                <UFormField label="Active">
                    <USwitch v-model="state.active" :default-value="true" />
                </UFormField>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <CancelButton />
                <SaveButton :loading="loading" @click="save()" />
            </div>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import useDomain from '~/composables/domain';
import SaveButton from './ui/button/SaveButton.vue';
import CancelButton from './ui/button/CancelButton.vue';

const { domainFormState: state, domainFormLoading: loading, save } = useDomain()

const title = computed(() => state.id ? state.name : 'New Domain') 
</script>