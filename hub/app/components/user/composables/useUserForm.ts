import type { Permission } from "#imports";
import {
  CreateDomainUserSchema,
  CreateSystemUserSchema,
  DomainUserSchema,
  SystemUserSchema,
  UpdateSystemUserSchema,
  type ApiResponse,
} from "@rey-one/shared";
import type z from "zod";
import { useAPI } from "~/composables/api";

type FormType = "systemUser" | "domainUser" | undefined;
type SystemUser = z.infer<typeof SystemUserSchema>;
type DomainUser = z.infer<typeof DomainUserSchema>;
type User = (
  | z.infer<typeof DomainUserSchema>
  | z.infer<typeof SystemUserSchema>
) & { password: string };

const defaultData: Partial<User> = {};

const defaultState = {
  referencePermissions: [] as Permission[],
  permissionChecks: [] as PermissionCheck[],
  type: undefined as FormType,
  data: nullToUndefined(defaultData),
  version: Date.now(),
  loading: false,
};

const userFormState = reactive<typeof defaultState>(defaultState);
const isSystemUserForm = computed(() => defaultState.type === "systemUser");

export default function () {
  function resetFormData() {
    userFormState.data = structuredClone(nullToUndefined(defaultData));
  }

  async function loadFormData(userId = userFormState.data.id) {
    if (typeof userId !== "string" || !userFormState.type) return;

    let result;

    if (isSystemUserForm.value) {
      result = await useAPI<ApiResponse<SystemUser>>(`/users/${userId}`);
    } else {
      result = await useAPI<ApiResponse<DomainUser>>(
        `/domains/members/${userId}`,
      );
    }

    userFormState.data = nullToUndefined(result.data);
  }

  async function save() {
    const { pushToast } = useNotification();

    const action = async () => {
      if (!userFormState.type) {
        pushToast({
          color: "warning",
          title: "Form type is required",
        });
        return;
      }

      let result;

      userFormState.data.permissions = userFormState.permissionChecks
        .filter((item) => item.active)
        .map((item) => item.name) as any;
      const data = userFormState.data;

      if (data.id) {
        if (isSystemUserForm.value) {
          result = await useAPI<ApiResponse<SystemUser>>(`/users/${data.id}`, {
            method: "PATCH",
            body: zodValidate(UpdateSystemUserSchema, data),
          });
        } else {
          result = await useAPI<ApiResponse<SystemUser>>(
            `/domains/members/${data.id}`,
            {
              method: "PATCH",
              body: zodValidate(DomainUserSchema, data),
            },
          );
        }

        pushToast({
          title: userFormState.data.name,
          description: "Updated",
        });
      } else {
        if (isSystemUserForm.value) {
          result = await useAPI<ApiResponse<SystemUser>>("/users", {
            method: "POST",
            body: zodValidate(CreateSystemUserSchema, data),
          });
        } else {
          result = await useAPI<ApiResponse<DomainUser>>("/domains/members", {
            method: "POST",
            body: zodValidate(CreateDomainUserSchema, data),
          });
        }

        pushToast({
          title: userFormState.data.name,
          description: "Created",
        });
      }

      userFormState.data = nullToUndefined(result.data);
    };

    userFormState.loading = true;
    try {
      await action();
      ++userFormState.version;
    } finally {
      userFormState.loading = false;
    }
  }

  return {
    userFormState,

    loadFormData,
    resetFormData,
    save,
  };
}
