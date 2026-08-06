import { apiErrorResponseSchema } from "@rey-one/shared";
import type { FetchResponse, ResolvedFetchOptions } from "ofetch";
import useDomain from "../domain";

export const useAPI = $fetch.create({
  baseURL: "/rmk-api",
  credentials: "include",
  onRequest({ options }) {
    requestOptionsConfig(options)
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useAsyncAPI = createUseFetch({
  baseURL: "/rmk-api",
  credentials: "include",
  onRequest({ options }) {
    requestOptionsConfig(options)
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useGuestAPI = $fetch.create({
  baseURL: "/rmk-api",
  onRequest({ options }) {
    requestOptionsConfig(options)
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

function requestOptionsConfig(options: ResolvedFetchOptions<any>) {
  const nuxtApp = useNuxtApp();
  nuxtApp.runWithContext(() => {
    const { accessDomainState } = useDomain()
    if (accessDomainState.domain) {
      options.headers.set('x-domain-id', accessDomainState.domain.domainId)
    }
  })
}

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
