import { CreateDomainSchema, type ApiResponse, type DomainSchema, type DomainView } from "@rey-one/shared"
import type z from "zod"
import { useAPI } from "./api"

type DomainForm = z.infer<typeof DomainSchema>

const domainFormLoading = ref(false)
const domainFormStateVersion = ref(Date.now())
const domainFormState = reactive<Partial<DomainForm>>({})

export default function useDomain() {
    const toast = useToast()

    function resetForm() {
        Object.assign(domainFormState, {})
    }

    async function save(onSuccess: () => Promise<void> = () => Promise.resolve()) {
        if (domainFormState.id) {

        } else {
            const payload = zodValidate(CreateDomainSchema, domainFormState)
            const response = await useAPI<ApiResponse<DomainView>>('/domains', {
                method: 'POST',
                body: payload
            })
            await onSuccess()
        }

        ++domainFormStateVersion.value
    }

    return {
        domainFormLoading,
        domainFormStateVersion,
        domainFormState,

        resetForm,
        save
    }
}