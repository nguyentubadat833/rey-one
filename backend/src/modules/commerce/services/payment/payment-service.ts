import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Currency, PaymentFlowType, PaymentMethod, PaymentProvider } from "@rey-one/shared";
import { CommerceService } from "../commerce-service";
import { Order } from "@/persistence/entities/commerce-order.entity";
import { OrderNotFoundError } from "@/utils/errors/order.error";
import { Payment } from "@/persistence/entities/commerce-payment.entity";
import { AppError } from "@/utils/errors/app.error";

export interface CreatePaymentInput {
    orderId: string
    provider: PaymentProvider
    method: PaymentMethod
    displayMode: PaymentFlowType
}

@Injectable()
export class PaymentService {
    constructor(
        private readonly commerceService: CommerceService,
        private readonly em: EntityManager
    ) { }

    async createPayment(input: CreatePaymentInput) {
        const order = await this.em.findOneOrFail(Order,
            {
                id: input.orderId
            },
            {
                failHandler: OrderNotFoundError,
                populate: ['domain', 'customer']
            }
        )
        this.commerceService.ensureOrderCanBePayment(order)

        if(order.paymentType !== 'one_time'){
            throw new AppError('ORDER_PAYMENT_NOT_SUPPORTED')
        }

        const payment = this.em.create(Payment, {
            order: order,
            amount: order.totalAmount,
            currency: order.currency,
            provider: input.provider,
            providerMethod: input.method,
            displayMode: input.displayMode,
            status: 'pending',
            rawPayload: undefined
        })

        await this.em.flush()
        return payment
    }
}