import {
  CreateDomainSchema,
  type ApiResponse,
  type DomainAvailableOption,
  type DomainSchema,
  type DomainView,
} from "@rey-one/shared";
import type z from "zod";
import { useAPI } from "./api";
import { UpdateDomainSchema } from "@rey-one/shared";
import useAuth from "./auth";

type DomainForm = z.infer<typeof DomainSchema>;

const domainFormLoading = ref(false);
const domainFormStateVersion = ref(Date.now());
const domainFormState = reactive<Partial<DomainForm>>({});

export default function useDomain() {
  function resetForm() {
    domainFormState.id = undefined;
    domainFormState.name = undefined;
    domainFormState.active = true;
    domainFormState.permissions = [];
  }

  async function getDomainOptions() {
    const result = await useAPI<ApiResponse<DomainAvailableOption[]>>('/domains/options')
  }

  async function save(
    onSuccess: () => Promise<void> = () => Promise.resolve(),
  ) {
    const { pushToast } = useNotification();

    if (domainFormState.id) {
      const payload = zodValidate(UpdateDomainSchema, domainFormState);
      const result = await useAPI<ApiResponse<DomainView>>(
        `/domains/${domainFormState.id}`,
        {
          method: "PATCH",
          body: payload,
        },
      );

      Object.assign(domainFormState, result.data);

      pushToast({
        title: payload.name,
        description: "Updated",
      });

      await onSuccess();
    } else {
      const payload = zodValidate(CreateDomainSchema, domainFormState);
      const result = await useAPI<ApiResponse<DomainView>>("/domains", {
        method: "POST",
        body: payload,
      });

      Object.assign(domainFormState, result.data);

      pushToast({
        title: payload.name,
        description: "Created",
      });

      await onSuccess();
    }

    ++domainFormStateVersion.value;
  }

  return {
    domainFormLoading,
    domainFormStateVersion,
    domainFormState,

    resetForm,
    save,
  };
}
