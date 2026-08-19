import {
    CreateDomainSchema,
    DomainSchema,
    type ApiResponse,
} from "@rey-one/shared";
import { UpdateDomainSchema } from "@rey-one/shared";
import type z from "zod";
import { useAPI } from "~/composables/api";

type Domain = z.infer<typeof DomainSchema>;

const defaultData: Partial<Domain> = {
    id: undefined,
    name: undefined,
    status: undefined,
    plan: 'monthly',
    owner: {
        email: '',
        status: "pending"
    },
    startedAt: undefined,
    expiresAt: undefined,
    permissions: [],
}

const domainFormState = reactive({
    permissionChecks: [] as PermissionCheck[],
    data: defaultData,
    version: Date.now(),
    loading: false,
});


export default function () {

    function resetFormData() {
        domainFormState.data = structuredClone(defaultData)
    }

    async function loadDomain(domainId = domainFormState.data.id) {
        const result = await useAPI<ApiResponse<Domain>>(`/domains/${domainId}`)
        domainFormState.data = nullToUndefined(result.data)
    }

    async function save() {
        // onSuccess: () => Promise<void> = () => Promise.resolve(),
        const process = async () => {
            const { pushToast } = useNotification()

            domainFormState.data.permissions = domainFormState.permissionChecks
                .filter((item) => item.active)
                .map((item) => item.name) as any

            if (domainFormState.data.id) {
                const payload = zodValidate(UpdateDomainSchema, domainFormState.data);
                const result = await useAPI<ApiResponse<Domain>>(
                    `/domains/${domainFormState.data.id}`,
                    {
                        method: "PATCH",
                        body: payload,
                    },
                );

                Object.assign(domainFormState.data, result.data);

                pushToast({
                    title: payload.name,
                    description: "Updated",
                });
            } else {
                const data = {
                    ...domainFormState.data,
                    email: domainFormState.data.owner?.email
                }
                const payload = zodValidate(CreateDomainSchema, data);
                const result = await useAPI<ApiResponse<Domain>>("/domains", {
                    method: "POST",
                    body: payload,
                });

                Object.assign(domainFormState.data, result.data);

                pushToast({
                    title: payload.name,
                    description: "Created",
                });
            }

            ++domainFormState.version;
        };

        try {
            domainFormState.loading = true;
            await process();
        } finally {
            domainFormState.loading = false;
        }
    }

    return {
        domainFormState,

        loadDomain,
        resetFormData,
        save,
    };
}