import useDomain from "~/composables/domain";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { accessDomainState, accessDomain } = useDomain();
  const { loadWorkingDomain } = accessDomain();

  await loadWorkingDomain()
  if (!accessDomainState.domain) {
    return abortNavigation(
      createError({
        status: 400,
        statusText: "BAS REQUEST",
        message: "Domain Required",
      }),
    );
  }
});
