import useDomain from "~/composables/domain";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { accessDomainState } = useDomain()

    if (!accessDomainState.domain) {
        return abortNavigation(
            createError({
                status: 400,
                statusText: "BAS REQUEST",
                message: "Domain Required"
            })
        );
    }
});
