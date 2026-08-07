import {
  CreateDomainSchema,
  type ApiResponse,
  type DomainWithRolesView,
  type DomainView,
  type UserDomainAccess,
} from "@rey-one/shared";
import { useAPI } from "./api";
import { UpdateDomainSchema } from "@rey-one/shared";
import useAuth from "./auth";

type DomainForm = DomainView;

const domainAvailableState = reactive({
  data: [] as DomainWithRolesView[],
  loading: false,
});

const domainFormState = reactive({
  data: {} as Partial<DomainForm>,
  version: Date.now(),
  loading: false,
});

const accessDomainState = reactive({
  domain: undefined as UserDomainAccess | undefined,
  list: undefined as UserDomainAccess[] | undefined,
  loading: false,
});

export default function useDomain() {
  const { loadAuthState } = useAuth();
  const router = useRouter();

  function resetForm() {
    domainFormState.data.id = undefined;
    domainFormState.data.name = undefined;
    domainFormState.data.active = true;
    domainFormState.data.permissions = [];
  }



  async function loadAvailable() {
    return useAPI<ApiResponse<DomainWithRolesView[]>>("/domains/available");
  }

  function accessDomain() {
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

      await router.push("/");
    };

    const leaveDomain = async () => {
      const userAuthId = (await loadAuthState()).userAuth?.id;
      if (!userAuthId) return;

      accessDomainState.domain = undefined;
      localStorage.removeItem(`${userAuthId}:working_domain`);

      await router.push("/");
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
      loadDomains,
      chooseDomain,
      leaveDomain,
      loadWorkingDomain,
    };
  }

  async function save(
    onSuccess: () => Promise<void> = () => Promise.resolve(),
  ) {
    const { pushToast } = useNotification();

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

      await onSuccess();
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

      await onSuccess();
    }

    ++domainFormState.version;
  }

  return {
    domainFormState,
    domainAvailableState,
    accessDomainState,
    resetForm,

    save,
    accessDomain,
    loadAvailable
  };
}
