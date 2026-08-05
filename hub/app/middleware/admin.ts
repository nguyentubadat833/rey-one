import useAuth from "~/composables/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loadAuthState } = useAuth();
  const authState = await loadAuthState();

  if (authState.userAuth?.user?.type !== "admin_user") {
    return abortNavigation();
  }
});
