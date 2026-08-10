import {
  CreateDomainSchema,
  type ApiResponse,
  type DomainView
} from "@rey-one/shared";
import { UpdateDomainSchema } from "@rey-one/shared";
import { useAPI } from "~/composables/api";
import type { PermissionCheck } from "~/types/domain-types";

type DomainForm = DomainView;

const domainFormState = reactive({
  permissionChecks: [] as PermissionCheck[],
  data: {} as Partial<DomainForm>,
  version: Date.now(),
  loading: false,
});


export default function () {

    function resetForm() {
        domainFormState.data.id = undefined;
        domainFormState.data.name = undefined;
        domainFormState.data.active = true;
        domainFormState.data.permissions = [];
    }

    async function save() {
        // onSuccess: () => Promise<void> = () => Promise.resolve(),
        const process = async () => {
            const { pushToast } = useNotification();

            domainFormState.data.permissions = domainFormState.permissionChecks
                .filter((item) => item.active)
                .map((item) => item.name);

            if (domainFormState.data.id) {
                const payload = zodValidate(UpdateDomainSchema, domainFormState.data);
                const result = await useAPI<ApiResponse<DomainView>>(
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
                const payload = zodValidate(CreateDomainSchema, domainFormState.data);
                const result = await useAPI<ApiResponse<DomainView>>("/domains", {
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

        resetForm,
        save,
    };
}