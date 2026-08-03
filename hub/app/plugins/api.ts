import { apiErrorResponseSchema } from "@rey-one/shared";
import type { FetchResponse } from 'ofetch';

export default defineNuxtPlugin((nuxtApp) => {


    const clientApi = $fetch.create({
        onRequest({ options }) {
            options.baseURL = '/rmk-api'
        },
        onResponseError({ response }) {
            hanlderErrorResponse(response)
        },
    });

    const userApi = $fetch.create({
        onRequest({ options }) {
            options.baseURL = '/rmk-api'
            options.credentials = "include";
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                nuxtApp.runWithContext(async () => await navigateTo("/auth/login"));
            } else {
                hanlderErrorResponse(response)
            }
        },
    });

    return {
        provide: {
            userApi,
            clientApi,
        },
    };
});

function hanlderErrorResponse(res: FetchResponse<any>) {
    const toast = useToast();

    if (!res.ok) {
        const parseError = apiErrorResponseSchema.safeParse(res._data)
        let message: string

        if (parseError.success) {
            message = parseError.data.error.message
        } else {
            message = 'Error'
        }

        toast.add({
            title: message,
            color: "error",
        });
    }
}