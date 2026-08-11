import { CreateOrderSchema, type ApiResponse, type OrderPaymentType, type OrderView } from "@rey-one/shared";
import type z from "zod";
import { useAPI } from "~/composables/api";

type CreateOrderInput = z.input<typeof CreateOrderSchema>
type PartyOrderInput = {
    id?: string
    name: string
}

const defaultData: Partial<OrderView> = {}

const orderFormState = reactive({
    data: nullToUndefined(defaultData),
    loading: false
})

export default function () {

    const { pushToast } = useNotification()

    async function loadOrder(id: string) {
        const result = await useAPI<ApiResponse<OrderView>>(`/orders/${id}`)
        orderFormState.data = nullToUndefined(result.data)
    }

    async function createOrder(partyOrder: PartyOrderInput, orderPaymentType: OrderPaymentType = 'one_time') {

        const data = orderFormState.data

        const input = {
            metadata: data.metadata,
            currency: 'VND',
            customer: partyOrder,
            totalAmount: data.totalAmount ?? 0,
            items: (data.items ?? []).map(item => ({
                ...item,
                productId: item.product.id
            }))
        } satisfies CreateOrderInput

        const result = await useAPI<ApiResponse<OrderView>>(`/orders`, {
            method: 'post',
            body: zodValidate(CreateOrderSchema, input)
        })

        Object.assign(orderFormState.data, nullToUndefined(result.data))

        pushToast({
            title: "Order created",
            description: `Total amount: ${data.totalAmount}${data.currency}`
        })
    }

    return {
        resetForm: () => { orderFormState.data = structuredClone(nullToUndefined(defaultData)) },
        createOrder,
        loadOrder,

        orderFormState
    }
}