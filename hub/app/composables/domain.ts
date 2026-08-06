import {
  CreateDomainSchema,
  type ApiResponse,
  type DomainSchema,
  type DomainView,
  type UserDomainAccess,
} from "@rey-one/shared";
import type z from "zod";
import { useAPI } from "./api";
import { UpdateDomainSchema } from "@rey-one/shared";
import useAuth from "./auth";

type DomainForm = z.infer<typeof DomainSchema>;

const domainFormState = reactive({
  data: {} as Partial<DomainForm>,
  version: Date.now(),
  loading: false,
});

const accessDomainState = reactive({
  domain: null as UserDomainAccess | null,
  list: [] as UserDomainAccess[],
  loading: false,
});

export default function useDomain() {
  const { loadAuthState } = useAuth();

  function resetForm() {
    domainFormState.data.id = undefined;
    domainFormState.data.name = undefined;
    domainFormState.data.active = true;
    domainFormState.data.permissions = [];
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
    };

    const loadWorkingDomain = async () => {
      const userAuthId = (await loadAuthState()).userAuth?.id;
      if (!userAuthId) return;

      const storageDomainId = localStorage.getItem(
        `${userAuthId}:working_domain`,
      );
      if (!storageDomainId) return;

      const domain = accessDomainState.list.find(
        (item) => item.domainId === storageDomainId,
      );
      accessDomainState.domain = domain ?? null;
    };

    return {
      loadDomains,
      chooseDomain,
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
    accessDomainState,
    resetForm,
    save,
    accessDomain,
  };
}
