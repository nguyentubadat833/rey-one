import { CreateDomainRoleSchema, type ApiResponse, type DomainRoleView } from "@rey-one/shared";
import { useAPI } from "~/composables/api";
import type { PermissionCheck } from "~/types/domain-types";

type RoleForm = DomainRoleView;

const roleFormState = reactive({
    permissionChecks: [] as PermissionCheck[],
    data: {} as Partial<RoleForm>,
    loading: false,
});

export default function () {
    const { pushToast } = useNotification()

    function resetForm() {
        roleFormState.permissionChecks = []
        roleFormState.data = Object.fromEntries(
            Object.keys(roleFormState.data).map(key => [key, undefined])
        )
    }

    async function save() {
        const process = async () => {
            let response

            roleFormState.data.permissions = roleFormState.permissionChecks.filter(item => item.active).map(item => item.name)
            const isCreate = roleFormState.data.id === undefined

            if (isCreate) {
                const payload = zodValidate(CreateDomainRoleSchema, roleFormState.data)
                response = await useAPI<ApiResponse<DomainRoleView>>('/domain-roles', {
                    method: 'POST',
                    body: payload
                })
                pushToast({
                    title: roleFormState.data.name,
                    description: "Created"
                })
            } else {
                const payload = zodValidate(CreateDomainRoleSchema, roleFormState.data)
                response = await useAPI<ApiResponse<DomainRoleView>>(`/domain-roles/${roleFormState.data.id}`, {
                    method: 'PATCH',
                    body: payload
                })
                pushToast({
                    title: roleFormState.data.name,
                    description: "Updated",
                    color: "info"
                })
            }

            Object.assign(roleFormState.data, response.data)
        }

        try {
            roleFormState.loading = true
            await process()
        } finally {
            roleFormState.loading = false
        }
    }

    return {
        roleFormState,

        resetForm,
        save
    }
}