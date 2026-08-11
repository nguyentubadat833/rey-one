import {
  CreateProductSchema,
  UpdateProductSchema,
  type ApiResponse,
  type ProductView,
} from "@rey-one/shared";
import { useAPI } from "~/composables/api";

const defaultData: Partial<ProductView> = {};

const productFormState = reactive({
  data: nullToUndefined(defaultData),
  loading: false,
});

export default function () {
  function resetForm() {
    productFormState.data = nullToUndefined(structuredClone(defaultData))
  }

  async function loadProduct(id: string) {
    const result = await useAPI<ApiResponse<ProductView>>(`/products/${id}`);
    Object.assign(productFormState.data, result.data);
  }

  async function save() {
    const process = async () => {
      const id = productFormState.data.id;

      const payload = zodValidate(
        id ? UpdateProductSchema : CreateProductSchema,
        productFormState.data,
      );

      const result: ApiResponse<ProductView> = id
        ? await useAPI(`/products/${id}`, {
            method: "patch",
            body: payload,
          })
        : await useAPI("/products", {
            method: "post",
            body: payload,
          });

      Object.assign(productFormState.data, result.data);
    };

    try {
      productFormState.loading = true;
      await process();
    } finally {
      productFormState.loading = false;
    }
  }

  return {
    productFormState,

    resetForm,

    loadProduct,
    save
  };
}
