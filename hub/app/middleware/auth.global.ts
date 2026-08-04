import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath = to.path;
  if (toPath === "/auth/login") return;

  const { loadAuthState } = useAuth();
  const authState = await loadAuthState()

  if (!authState.authenticated) {
    return navigateTo("/auth/login");
  }
});
