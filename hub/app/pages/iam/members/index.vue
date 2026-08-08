<template>
    <div>members</div>
</template>
<script setup lang="ts">
import { useAPI } from '~/composables/api';
import useDomain from '~/composables/domain';

definePageMeta({
    middleware: ['domain']
})

const { accessDomainState } = useDomain()

const {data: roles}  = await useLazyAsyncData(`domain_${accessDomainState.domain?.domainId}_roles`, () => useAPI('/domain-roles'))
</script>