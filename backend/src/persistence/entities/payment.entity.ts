import { defineEntity } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';
import { Order } from './order.entity';
import { CURRENCIES, PAYMENT_METHODS, PAYMENT_STATUS_TRANSITIONS, PAYMENT_STATUSES, PaymentStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { BaseEntitySchema } from './base.entity';
import { domainFilter } from './configs/doamin-tenant.filter';
import randomstring from 'randomstring'

const PaymentEntitySchema = defineEntity({
  name: 'PaymentEntity',
  tableName: 'payment',
  extends: BaseEntitySchema,
  filters: domainFilter,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generatePaymentCode),
    order: () => p.manyToOne(Order).ref(),
    // installment: p.manyToOne(() => OrderInstallmentEntitySchema).nullable(),

    amount: p.bigint().check((columns) => `${columns.amount} > 0`),
    currency: p.enum(CURRENCIES),
    status: p.enum(PAYMENT_STATUSES).index().accessor('_status'),
    // provider: p.enum(PAYMENT_PROVIDERS),
    method: p.enum(PAYMENT_METHODS),
    transactionId: p.string().nullable().index().fieldName('transaction_id'),
    // displayMode: p.enum(PAYMENT_FLOW_TYPES).nullable().fieldName('display_mode'),
    rawPayload: p.json().nullable().default(null).fieldName('raw_payload'),

    paidAt: p.datetime().nullable().fieldName('paid_at'),
    failedReason: p.string().nullable().fieldName('failed_reason'),
  }),
});

export class Payment extends PaymentEntitySchema.class {
  private _status!: PaymentStatus;

  get status(): PaymentStatus {
    return this._status;
  }

  set status(value: PaymentStatus) {
    // 1. Cho phép gán giá trị lần đầu tiên khi _status chưa được set
    if (!this._status) {
      this._status = value;
      return;
    }

    // 2. Nếu đã có status cũ, tiến hành kiểm tra luồng chuyển đổi (Transition)
    const allowedStatuses = PAYMENT_STATUS_TRANSITIONS[this._status] ?? [];

    if (!allowedStatuses.includes(value)) {
      throw AppError.withMessage(
        'INVALID_STATUS_TRANSITION',
        `Cannot change payment status from "${this._status}" to "${value}". Allowed next statuses: ${
          allowedStatuses.length > 0 ? allowedStatuses.join(', ') : 'none'
        }.`,
      );
    }

    this._status = value;
  }
}
PaymentEntitySchema.setClass(Payment);

function generatePaymentCode(){
  const code = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHJKLMNBVCXZ'
  })
  
  return `PAM${code}`
}