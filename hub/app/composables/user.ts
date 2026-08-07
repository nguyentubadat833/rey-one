import {
  CreateUserSchema,
  UpdateUserSchema,
  type ApiResponse,
  type UserDetailView,
} from "@rey-one/shared";
import { useAPI } from "./api";

const defaultData: Partial<
  UserDetailView & {
    password: string;
  }
> = {};

const defaultState = {
  data: nullToUndefined(defaultData),
  version: Date.now(),
  loading: false,
};

const userFormState = reactive<typeof defaultState>(defaultState);

export default function useUser() {
  function resetState() {
    Object.assign(userFormState, defaultState);
  }

  function resetForm() {
    Object.assign(userFormState.data, defaultData);
  }

  async function save(
    onSuccess: () => Promise<void> = () => Promise.resolve(),
  ) {
    const { pushToast } = useNotification();
    const data = userFormState.data;
    console.log(data)

    const action = async () => {
      let result;

      if (data.id) {
        const payload = zodValidate(CreateUserSchema, data);
        result = await useAPI<ApiResponse<UserDetailView>>(
          `/users/${data.id}`,
          {
            method: "PATCH",
            body: payload,
          },
        );

        pushToast({
          title: userFormState.data.name,
          description: "Updated",
        });
      } else {
        const payload = zodValidate(UpdateUserSchema, data);
        result = await useAPI<ApiResponse<UserDetailView>>("/users", {
          method: "POST",
          body: payload,
        });

        pushToast({
          title: userFormState.data.name,
          description: "Created",
        });
      }

      userFormState.data = nullToUndefined(result.data);

      await onSuccess();
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

    resetState,
    resetForm,
    save,
  };
}
