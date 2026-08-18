import { apiErrorResponseSchema } from "@rey-one/shared";
import { useAccessDomains } from "../domain";
import type { FetchResponse, ResolvedFetchOptions } from "ofetch";

export const useAPI = $fetch.create({
  baseURL: "/rmk-api",
  credentials: "include",
  onRequest({ options }) {
    requestOptionsConfig(options);
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useAsyncAPI = createUseFetch({
  baseURL: "/rmk-api",
  credentials: "include",
  onRequest({ options }) {
    requestOptionsConfig(options);
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

export const useGuestAPI = $fetch.create({
  baseURL: "/rmk-api",
  onRequest({ options }) {
    requestOptionsConfig(options);
  },
  onResponseError({ response }) {
    handlerResponseError(response);
  },
});

function requestOptionsConfig(options: ResolvedFetchOptions<any>) {
  const nuxtApp = useNuxtApp();
  // const { accessDomainState } = useAccessDomains();
  // console.log(accessDomainState)
  nuxtApp.runWithContext(() => {
    const { accessDomainState } = useAccessDomains();
    if (accessDomainState.domain) {
      options.headers.set("x-domain-id", accessDomainState.domain.id);
    }
  });
}

function handlerResponseError(response: FetchResponse<any>) {
  if (!response.ok) {
    const nuxtApp = useNuxtApp();

    if (response.status === 401) {
      nuxtApp.runWithContext(() => {
        const router = useRouter();
        if (router.currentRoute.value.path !== "/auth/login") {
          router.push("/auth/login");
        }
      });
      return;
    }

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
