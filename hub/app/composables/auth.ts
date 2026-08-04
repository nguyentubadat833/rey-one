import {
  BaseLoginSchema,
  type ApiResponse,
  type UserLoginResponse,
  type UserView,
} from "@rey-one/shared";
import type z from "zod";
import { useGuestAPI, useAsyncAPI } from "./api";

type BaseLoginForm = z.input<typeof BaseLoginSchema>;

const authState = reactive({
  user: null as null | UserView,
  authenticated: false,
});

const authFormState = reactive<Partial<BaseLoginForm>>({});

export default function useAuth() {
  function setAuth(user: UserView) {
    authState.authenticated = true;
    authState.user = user;
  }

  function clearAuth() {
    authState.user = null;
    authState.authenticated = false;
  }

  async function login(
    onSuccess: () => Promise<void> = () => Promise.resolve(),
  ) {
    const payload = zodValidate(BaseLoginSchema, authFormState);
    if (payload) {
      const response = await useGuestAPI<ApiResponse<UserLoginResponse>>(
        "/auth/login",
        {
          method: "POST",
          body: payload
        },
      );

      setAuth(response.data.user);
      await onSuccess();
    }
  }

  async function loadAuthState() {
    if (!authState.authenticated) {
      const { data: res } = await useAsyncAPI<ApiResponse<UserView>>("/auth", {
        retry: 3,
        retryDelay: 4000,
      });
      if (res.value) {
        setAuth(res.value.data);
      }
    }

    return authState;
  }

  function logout() {
    clearAuth();
  }

  return {
    authState,
    authFormState,

    login,
    logout,
    loadAuthState,
  };
}

// export default createSharedComposable(_useAuth)
