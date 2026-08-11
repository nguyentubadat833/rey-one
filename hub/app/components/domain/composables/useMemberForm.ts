import {
  CreateDomainMemberSchema,
  UpdateDomainMemberSchema,
  type ApiResponse,
  type DomainMemberDetailView,
  type DomainMemberView,
  type DomainRoleView,
} from "@rey-one/shared";
import { useAPI } from "~/composables/api";

const defaultData: Partial<DomainMemberView> = {};

const memberFormState = reactive({
  data: nullToUndefined(defaultData),
  loading: false,
});

type RoleResponse = ApiResponse<DomainRoleView>;
export default function () {
  const { pushToast } = useNotification();

  function resetFormData() {
    memberFormState.data = structuredClone(nullToUndefined(defaultData));
  }

  async function loadMember(id: string){
    const result = await useAPI<ApiResponse<DomainMemberDetailView>>(`/domain-members/${id}`)
    Object.assign(memberFormState.data, result.data)
  }

  async function save() {
    const process = async () => {
      const data = {
        ...memberFormState.data,
        roleId: memberFormState.data.role?.id
      }

      let result;
      if (!data.id) {
        const payload = zodValidate(CreateDomainMemberSchema, data);
        result = await useAPI<RoleResponse>("/domain-members", {
          method: "post",
          body: payload,
        });

        pushToast({
          title: result.data.name,
          description: "Created",
        });
      } else {
        const payload = zodValidate(UpdateDomainMemberSchema, data);
        result = await useAPI<RoleResponse>(`/domain-members/${data.id}`, {
          method: "patch",
          body: payload,
        });

        pushToast({
          title: result.data.name,
          description: "Updated",
          color: "info",
        });
      }

      Object.assign(memberFormState.data, result);
    };

    try {
      memberFormState.loading = true;
      await process();
    } finally {
      memberFormState.loading = false;
    }
  }

  return {
    memberFormState,

    resetFormData,

    loadMember,
    save,
  };
}
