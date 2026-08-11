<template>
  <form class="space-y-5">
    <CopyableField :model-value="productData.id" />
    <SkuField :is-disabled="isFieldLocked" v-model:sku="productData.sku" />
    <ProductTypeField
      :is-disabled="isFieldLocked"
      v-model:type="productData.type"
    />
    <NameField v-model:name="productData.name" placeholder="Enter product name ..."/>
    <CurrencyField v-model:currency="productData.currency" />
    <CostField v-model:cost="productData.defaultCost" />
    <TextField v-model:text="productData.description" label="Descriptionn" />
    <ActiveField
      :is-disabled="isFieldLocked"
      :default-value="false"
      v-model:active="productData.trackingInventory"
      label="Tracking Inventory"
    />
    <ProductStatusField v-model:status="productData.status" />
  </form>
</template>
<script setup lang="ts">
import ActiveField from "../ui/input/binding-input/ActiveField.vue";
import CopyableField from "../ui/input/binding-input/CopyableField.vue";
import CostField from "../ui/input/binding-input/CostField.vue";
import CurrencyField from "../ui/input/binding-input/CurrencyField.vue";
import NameField from "../ui/input/binding-input/NameField.vue";
import ProductStatusField from "../ui/input/binding-input/ProductStatusField.vue";
import ProductTypeField from "../ui/input/binding-input/ProductTypeField.vue";
import SkuField from "../ui/input/binding-input/SkuField.vue";
import TextField from "../ui/input/binding-input/TextField.vue";
import useProductForm from "./composables/useProductForm";

const { productFormState } = useProductForm();
const productData = toRef(productFormState, "data");

const isFieldLocked = computed(() => !!productData.value.id);
</script>
