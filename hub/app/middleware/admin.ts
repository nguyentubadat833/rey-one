import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loadAuthState } = useAuth();
  const authState = await loadAuthState();

  if (authState.userAuth?.type !== "admin_user") {
    return abortNavigation();
  }
});
