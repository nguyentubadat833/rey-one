import type { BaseLoginSchema, UserLoginResponse, UserView } from "@rey-one/shared";
import type z from "zod";

const authState = reactive({
    user: null as null | UserView,
    authenticated: false
})

export default function useAuth() {

    const { $clientApi } = useNuxtApp()

    function setAuth(user: UserView) {
        authState.authenticated = true
        authState.user = user
    }

    function clearAuth() {
        authState.user = null
        authState.authenticated = false
    }

    async function login(req: z.input<typeof BaseLoginSchema>) {
        const loginResult = await $clientApi<UserLoginResponse>('/auth/login', {
            method: 'post',
            body: req
        })

        setAuth(loginResult.user)
    }

    function logout() {
        clearAuth()
    }

    return {
        authState,

        login,
        logout
    }
}