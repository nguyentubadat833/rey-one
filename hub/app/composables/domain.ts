import {
  CreateDomainSchema,
  type ApiResponse,
  type DomainWithRolesView,
  type DomainView,
  type UserDomainAccess,
  type AppPermission,
  type DomainRoleView,
} from "@rey-one/shared";
import { useAPI } from "./api";
import { UpdateDomainSchema } from "@rey-one/shared";
import useAuth from "./auth";
import type { PermissionCheck } from "~/types/domain-types";

type DomainForm = DomainView;
type RoleForm = DomainRoleView;

const roleFormState = reactive({
  permissionChecks: [] as PermissionCheck[],
  data: {} as Partial<RoleForm>,
  loading: false,
});

const domainAvailableState = reactive({
  data: [] as DomainWithRolesView[],
  loading: false,
});

const domainFormState = reactive({
  permissionChecks: [] as PermissionCheck[],
  data: {} as Partial<DomainForm>,
  version: Date.now(),
  loading: false,
});

const accessDomainState = reactive({
  domain: undefined as UserDomainAccess | undefined,
  list: undefined as UserDomainAccess[] | undefined,
  loading: false,
});

const accessDomainId = computed(() => accessDomainState.domain?.domainId);

export function useDomainForm() {

  function resetForm() {
    domainFormState.data.id = undefined;
    domainFormState.data.name = undefined;
    domainFormState.data.active = true;
    domainFormState.data.permissions = [];
  }

  async function save() {
    // onSuccess: () => Promise<void> = () => Promise.resolve(),
    const process = async () => {
      const { pushToast } = useNotification();

      domainFormState.data.permissions = domainFormState.permissionChecks
        .filter((item) => item.active)
        .map((item) => item.name);

      if (domainFormState.data.id) {
        const payload = zodValidate(UpdateDomainSchema, domainFormState.data);
        const result = await useAPI<ApiResponse<DomainView>>(
          `/domains/${domainFormState.data.id}`,
          {
            method: "PATCH",
            body: payload,
          },
        );

        Object.assign(domainFormState.data, result.data);

        pushToast({
          title: payload.name,
          description: "Updated",
        });
      } else {
        const payload = zodValidate(CreateDomainSchema, domainFormState.data);
        const result = await useAPI<ApiResponse<DomainView>>("/domains", {
          method: "POST",
          body: payload,
        });

        Object.assign(domainFormState.data, result.data);

        pushToast({
          title: payload.name,
          description: "Created",
        });
      }

      ++domainFormState.version;
    };

    try {
      domainFormState.loading = true;
      await process();
    } finally {
      domainFormState.loading = false;
    }
  }

  return {
    domainFormState,

    resetForm,
    save,
  };
}

export function useAccessDomains() {
  const { loadAuthState } = useAuth();

  const loadDomains = async () => {
    accessDomainState.loading = true;
    try {
      const result =
        await useAPI<ApiResponse<UserDomainAccess[]>>("/me/domains");

      accessDomainState.list = result.data;
    } finally {
      accessDomainState.loading = false;
    }
  };

  const chooseDomain = async (domain: UserDomainAccess) => {
    const userAuthId = (await loadAuthState()).userAuth?.id;
    if (!userAuthId) return;

    accessDomainState.domain = domain;
    localStorage.setItem(`${userAuthId}:working_domain`, domain.domainId);
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
      (item) => item.domainId === storageDomainId,
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

export function useDomainUtils() {
  function createPermissionsChecks(input: {
    currentPermissions?: AppPermission[];
    referencePermissions?: AppPermission[];
  }): PermissionCheck[] {
    if (input.referencePermissions) {
      return input.referencePermissions.map((pms) => ({
        name: pms,
        active: input.currentPermissions?.includes(pms) ?? false,
      }));
    } else {
      return (
        input.currentPermissions?.map((pms) => ({
          name: pms,
          active: true,
        })) ?? []
      );
    }
  }

  async function loadAvailable() {
    return useAPI<ApiResponse<DomainWithRolesView[]>>("/domains/available");
  }

  return {
    domainAvailableState,
    loadAvailable,
    createPermissionsChecks,
  };
}
