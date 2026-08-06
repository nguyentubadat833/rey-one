import type { ApiResponse, UserDetailView, UserView } from "@rey-one/shared";
import { useAPI } from "./api";

const defaultData: Partial<UserDetailView> = {}

const defaultState = {
    data: defaultData,
    version: Date.now(),
    loading: false,
}

const userFormState = reactive<typeof defaultState>(defaultState)

export default function useUser() {

    function resetState() {
        Object.assign(userFormState, defaultState)
    }

    function resetForm() {
        Object.assign(userFormState.data, defaultData)
    }

    async function save(
        onSuccess: () => Promise<void> = () => Promise.resolve()
    ) {
        const { pushToast } = useNotification()
        const data = userFormState.data

        const action = async () => {
            if (data.id) {

            } else {
                const result = await useAPI<ApiResponse<UserDetailView>>('/users', {
                    method: 'POST'
                })

                userFormState.data = result.data
            }
        }
    }

    return {
        userFormState,

        resetState,
        resetForm
    }
}