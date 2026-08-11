<template>
    <form class="space-y-5">
        <CopyableField :model-value="orderFormData.id"/>
        <OrderPaymentTypeField v-model:type="orderFormData.paymentType"/>
        <CurrencyField v-model:currency="orderFormData.currency"/>
        
    </form>
</template>

<script setup lang="ts">
import CopyableField from '../ui/input/fields/CopyableField.vue';
import CurrencyField from '../ui/input/fields/CurrencyField.vue';
import OrderPaymentTypeField from '../ui/input/fields/OrderPaymentTypeField.vue';
import useOrderForm from './composables/useOrderForm';

const {createOrder, orderFormState} = useOrderForm()
const orderFormData = toRef(orderFormState, 'data')
</script>