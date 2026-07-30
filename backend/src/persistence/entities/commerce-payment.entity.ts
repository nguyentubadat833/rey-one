import { defineEntity } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';
import { Order } from './commerce-order.entity';
import { CURRENCIES, PAYMENT_FLOW_TYPES, PAYMENT_PROVIDERS, PAYMENT_STATUS_TRANSITIONS, PAYMENT_STATUSES, PaymentStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { BaseEntitySchema } from './base.entity';

const PaymentEntitySchema = defineEntity({
  name: 'CommercePayment',
  tableName: 'commerce_payment',
  extends: BaseEntitySchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    order: () => p.manyToOne(Order).ref(),
    // installment: p.manyToOne(() => OrderInstallmentEntitySchema).nullable(),

    amount: p.bigint().check((columns) => `${columns.amount} > 0`),
    currency: p.enum(CURRENCIES),
    status: p.enum(PAYMENT_STATUSES).default('pending').index().accessor('_status'),
    provider: p.enum(PAYMENT_PROVIDERS),
    providerTransactionId: p.string().nullable().index().fieldName('provider_transaction_id'),
    displayMode: p.enum(PAYMENT_FLOW_TYPES).nullable().fieldName('display_mode'),
    rawPayload: p.json().nullable().fieldName('raw_payload'),

    paidAt: p.datetime().nullable().fieldName('paid_at'),
    failedReason: p.string().nullable().fieldName('failed_reason'),
  }),
});

export class Payment extends PaymentEntitySchema.class {
  private _status!: PaymentStatus;

  get status(): PaymentStatus {
    return this._status;
  }

  private set status(value: PaymentStatus) {
    const allowedStatuses = PAYMENT_STATUS_TRANSITIONS[this._status];

    if (!allowedStatuses.includes(value)) {
      throw AppError.withMessage(
        'INVALID_STATUS_TRANSITION',
        `Cannot change payment status from "${this._status}" to "${value}". Allowed next statuses: ${allowedStatuses.length > 0 ? allowedStatuses.join(', ') : 'none'}.`,
      );
    }

    this._status = value;
  }
}
PaymentEntitySchema.setClass(Payment);
