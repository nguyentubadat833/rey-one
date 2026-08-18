import {useAccessDomains} from "~/composables/domain";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { accessDomainState, loadWorkingDomain } = useAccessDomains();
  
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
