import { apiErrorResponseSchema } from "@rey-one/shared";
import { type FetchResponse } from "ofetch";

export const useAPI = $fetch.create({
  baseURL: "/rmk-api",
  credentials: "include",
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useAsyncAPI = createUseFetch({
  baseURL: "/rmk-api",
  credentials: "include",
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useGuestAPI = $fetch.create({
  baseURL: "/rmk-api",
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});
function handlerResponseError(response: FetchResponse<any>) {
  if (!response.ok) {
    const nuxtApp = useNuxtApp();

    const parseError = apiErrorResponseSchema.safeParse(response._data);
    const message = parseError.success
      ? parseError.data.error.message
      : "Unknown";

    nuxtApp.runWithContext(() => {
      const toast = useToast();

      toast.add({
        title: "API Error",
        description: message,
        color: "error",
        icon: "ic:baseline-warning-amber",
      });
    });
  }
}
