import {
  BaseLoginSchema,
  type ApiResponse,
  type UserLoginResponse,
  type UserView,
} from "@rey-one/shared";
import type z from "zod";
import { useGuestAPI, useAsyncAPI } from "./api";

type UserAuth = UserView;
type BaseLoginForm = z.input<typeof BaseLoginSchema>;

const authState = reactive({
  userAuth: null as null | UserAuth,
  authenticated: false,
});

const authFormState = reactive<Partial<BaseLoginForm>>({});

export default function useAuth() {
  function setAuth(userAuth: UserAuth) {
    authState.authenticated = true;
    authState.userAuth = userAuth;
  }

  function clearAuth() {
    authState.userAuth = null;
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
          body: payload,
        },
      );

      setAuth(response.data.user);
      await onSuccess();
    }
  }

  async function loadAuthState() {
    if (!authState.authenticated) {
      const { data: res } = await useAsyncAPI<ApiResponse<UserView>>("/me", {
        retry: 3,
        retryDelay: 4000,
      });
      if (res.value) {
        setAuth(res.value.data);
      }
    }

    return authState;
  }

  async function logout() {
    const accessTokenCookie = useCookie("access_token");
    accessTokenCookie.value = null;

    clearNuxtData();
    clearNuxtState();

    window.location.href = "/auth/login";
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
