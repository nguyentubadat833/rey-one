import {
  DomainAvailableSchema,
  type ApiResponse,
} from "@rey-one/shared";
import { useAPI } from "./api";
import useAuth from "./auth";
import type z from "zod";

type DomainAvailable = z.infer<typeof DomainAvailableSchema>;

const accessDomainState = reactive({
  domain: undefined as DomainAvailable | undefined,
  list: undefined as DomainAvailable[] | undefined,
  loading: false,
});

const accessDomainId = computed(() => accessDomainState.domain?.id);

export function useAccessDomains() {
  const { loadAuthState } = useAuth();

  const loadDomains = async () => {
    accessDomainState.loading = true;

    let domains: DomainAvailable[] = [];

    const authState = await loadAuthState();
    if (authState.userAuth?.scope.type === "domain") {

      const scope = authState.userAuth.scope;
      domains.push({
        id: scope.domainId,
        name: scope.domainName,
        image: undefined,
      });

    } else {

      try {
        const result = await useAPI<ApiResponse<DomainAvailable[]>>("/domains/available");
        accessDomainState.list = result.data;
      } finally {
        accessDomainState.loading = false;
      }

    }
  };

  const chooseDomain = async (domain: DomainAvailable) => {
    const userAuthId = (await loadAuthState()).userAuth?.id;
    if (!userAuthId) return;

    accessDomainState.domain = domain;
    localStorage.setItem(`${userAuthId}:working_domain`, domain.id);
  };

  const leaveDomain = async () => {
    const userAuthId = (await loadAuthState()).userAuth?.id;
    if (!userAuthId) return;

    accessDomainState.domain = undefined;
    localStorage.removeItem(`${userAuthId}:working_domain`);

    await navigateTo("/");
  };

  const loadWorkingDomain = async () => {
    const userAuthId = (await loadAuthState()).userAuth?.id;
    if (!userAuthId) return;

    const storageDomainId = localStorage.getItem(
      `${userAuthId}:working_domain`,
    );
    if (!storageDomainId) return;

    if (!accessDomainState.list) await loadDomains();

    const domain = accessDomainState.list?.find(
      (item) => item.id === storageDomainId,
    );
    if (!domain) return;

    await chooseDomain(domain);
  };

  return {
    accessDomainState,
    accessDomainId,

    loadDomains,
    chooseDomain,
    leaveDomain,
    loadWorkingDomain,
  };
}

// export function useDomainUtils() {
//   async function loadAvailable() {
//     return useAPI<ApiResponse<Domain[]>>("/domains/available");
//   }

//   return {
//     domainAvailableState,
//     loadAvailable,
//   };
// }
