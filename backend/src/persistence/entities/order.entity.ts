import { ChangeSetType, defineEntity, EventArgs } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { AppError } from '@/utils/errors/app.error';
import { Domain } from './domain.entity';
import { Product } from './product.entity';
import { Payment } from './payment.entity';
import { CURRENCIES, ORDER_PAYMENT_TYPES, ORDER_STATUS_TRANSITIONS, ORDER_STATUSES, OrderPaymentType, OrderStatus } from '@rey-one/shared';
import { User } from './user.entity';
import { domainFilter } from './configs/doamin-tenant.filter';
import randomstring from 'randomstring';

const OrderEntitySchema = defineEntity({
  name: 'OrderEntity',
  tableName: 'order',
  extends: BaseEntitySchema,
  filters: domainFilter,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateOrderCode),
    paymentType: p.enum(ORDER_PAYMENT_TYPES).index().default('one_time').fieldName('payment_type'),
    status: p.enum(ORDER_STATUSES).default('draft').index().accessor('_status'),

    currency: p.enum(CURRENCIES).default('VND'),
    // totalOriginalAmount: p.bigint(),
    // totalDiscountAmount: p.bigint().default(0),
    totalAmount: p
      .bigint()
      .fieldName('total_amount')
      .check((columns) => `${columns.totalAmount} >= 0`),
    paidAmount: p
      .bigint()
      .default(0)
      .fieldName('paid_amount')
      .check((columns) => `${columns.paidAmount} >= 0`), // denormalized, cộng dồn mỗi khi Payment succeeded nếu là thanh toán nhiều lần

    // chỉ có giá trị khi sourceModule = 'subscription' / paymentType = 'recurring'
    // subscription: p.manyToOne(() => SubscriptionEntitySchema).nullable(),
    // billingPeriodStart: p.datetime().nullable(),
    // billingPeriodEnd: p.datetime().nullable(),

    metadata: p.json().nullable(), // subsystem promotion, totalOriginalAmount, totalDiscountAmount
    expiresAt: p.datetime().nullable().fieldName('expires_at'),
    completedAt: p.datetime().nullable().fieldName('completed_at'),
    cancelledAt: p.datetime().nullable().fieldName('cancelled_at'),

    domain: () => p.manyToOne(Domain),
    customer: () => p.manyToOne(User).eager(),
    createdBy: () => p.manyToOne(User).fieldName('created_by'),

    items: () =>
      p
        .oneToMany(OrderItem)
        .mappedBy((item) => item.order)
        .orphanRemoval()
        .ref(),
    payments: () =>
      p
        .oneToMany(Payment)
        .mappedBy((payment) => payment.order)
        .orphanRemoval()
        .ref(),
    // installments: p.oneToMany(
    //   () => OrderInstallmentEntitySchema,
    //   (i) => i.order,
    // ), // rỗng nếu không phải 'installment'
  }),
});

export class Order extends OrderEntitySchema.class {
  declare readonly paymentType: OrderPaymentType;
  private _status!: OrderStatus;

  get status(): OrderStatus {
    return this._status;
  }

  set status(value: OrderStatus) {
    const allowedStatuses = ORDER_STATUS_TRANSITIONS[this._status];

    if (!allowedStatuses.includes(value)) {
      throw AppError.withMessage(
        'INVALID_STATUS_TRANSITION',
        `Cannot change order status from "${this._status}" to "${value}". Allowed next statuses: ${allowedStatuses.length > 0 ? allowedStatuses.join(', ') : 'none'}.`,
      );
    }

    this._status = value;
  }
}
OrderEntitySchema.setClass(Order);
OrderEntitySchema.addHook('beforeCreate', saveHandler);
OrderEntitySchema.addHook('beforeUpdate', saveHandler);

function saveHandler(args: EventArgs<Order>) {
  const changeSetType = args.changeSet?.type;

  if (!changeSetType) {
    return;
  }

  const currentEntity = args.entity;
  const oldEntity = args.changeSet?.originalEntity;

  if (changeSetType === ChangeSetType.CREATE) {
    if (currentEntity.paymentType !== 'one_time') {
      throw AppError.withMessage('FEATURE_NOT_IMPLEMENTED', `The payment type '${currentEntity.paymentType}' is not supported yet.`);
    }
  }

  if (changeSetType === ChangeSetType.UPDATE && oldEntity) {
    const isChangedPaymentType = oldEntity.paymentType !== currentEntity.paymentType;

    if (isChangedPaymentType) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Payment type cannot be changed');
    }

    if (currentEntity.status !== 'draft') {
      const isChangedCurrency = oldEntity.currency !== currentEntity.currency;
      const isChangedTotalAmount = oldEntity.totalAmount !== currentEntity.totalAmount;

      if (isChangedCurrency) {
        throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Currency cannot be changed');
      }

      if (isChangedTotalAmount) {
        throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Total amount cannot be changed');
      }
    }
  }
}

function generateOrderCode() {
  const code = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHJKLMNBVCXZ',
  });

  return `ORD${code}`;
}

// ============ ORDER ITEM ============

const OrderItemEntitySchema = defineEntity({
  name: 'OrderItemEntity',
  tableName: 'order_item',
  extends: BaseEntitySchema,
  properties: (p) => ({
    id: p.uuid().primary().onCreate(uuidv7),
    order: () => p.manyToOne(Order).ref(),
    product: () => p.manyToOne(Product),

    quantity: p
      .integer()
      .default(1)
      .check((columns) => `${columns.quantity} > 0`), // số lượng
    // unitPriceOriginal: p.bigint(), // giá gốc 1 đơn vị trước khi áp khuyến mãi
    // unitPriceFinal: p.bigint(), // giá đơn vị sau khi áp khuyến mãi
    // discountAmount: p.bigint().default(0), // số tiền được giảm
    subtotal: p.bigint().check((columns) => `${columns.subtotal} >= 0`), // tổng tiền cuối cùng
    metadata: p.json().nullable(), // unitPriceOriginal, unitPriceFinal, discountAmount, promotion ...
  }),
});
export class OrderItem extends OrderItemEntitySchema.class {}
OrderItemEntitySchema.setClass(OrderItem);
OrderItemEntitySchema.addHook('beforeUpdate', async (args) => {
  const orderEntity = await args.entity.order.loadOrFail();

  if (orderEntity.status !== 'draft' && args.changeSet?.payload) {
    throw AppError.withMessage('BUSINESS_RULE_VIOLATION', 'Order items can only be updated while the order is in draft status');
  }
});
OrderItemEntitySchema.addHook('beforeDelete', async (args) => {
  const orderEntity = await args.entity.order.loadOrFail();

  if (orderEntity.status !== 'draft') {
    throw AppError.withMessage('BUSINESS_RULE_VIOLATION', 'Order items can only be deleted while the order is in draft status');
  }
});

// // ============ ORDER INSTALLMENT (chỉ dùng khi paymentType = 'installment') ============

// // const OrderInstallmentEntitySchema = defineEntity({
// //   name: 'CommerceOrderInstallment',
// //   tableName: 'commerce_order_installment',
// //   properties: (p) => ({
// //     id: p.uuid().primary().onCreate(uuidv7),
// //     order: p.manyToOne(() => OrderEntitySchema),

// //     sequence: p.smallint(),
// //     dueDate: p.datetime().nullable(),
// //     amount: p.bigint(),
// //     status: p.enum(INSTALLMENT_STATUSES).default('pending'),

// //     payments: p.oneToMany(() => PaymentEntitySchema, (payment) => payment.installment),
// //     paidAt: p.datetime().nullable(),
// //     createdAt: p.datetime().onCreate(() => new Date()),
// //   }),
// // });

// // ============ SUBSCRIPTION (chỉ dùng khi bán gói recurring: Pro/Enterprise) ============

// // const SubscriptionPlanEntitySchema = defineEntity({
// //   name: 'CommerceSubscriptionPlan',
// //   tableName: 'commerce_subscription_plan',
// //   properties: (p) => ({
// //     id: p.uuid().primary().onCreate(uuidv7),
// //     code: p.string().unique(),
// //     name: p.string(),
// //     prices: p.oneToMany(() => SubscriptionPlanPriceEntitySchema, (pr) => pr.plan),
// //     isActive: p.boolean().default(true),
// //     createdAt: p.datetime().onCreate(() => new Date()),
// //   }),
// // });

// // const SubscriptionPlanPriceEntitySchema = defineEntity({
// //   name: 'CommerceSubscriptionPlanPrice',
// //   tableName: 'commerce_subscription_plan_price',
// //   properties: (p) => ({
// //     id: p.uuid().primary().onCreate(uuidv7),
// //     plan: p.manyToOne(() => SubscriptionPlanEntitySchema),
// //     interval: p.enum(BILLING_INTERVALS),
// //     intervalCount: p.smallint(),
// //     amount: p.bigint(),
// //     currency: p.string().length(3).default('VND'),
// //     isActive: p.boolean().default(true),
// //   }),
// // });

// // const SubscriptionEntitySchema = defineEntity({
// //   name: 'CommerceSubscription',
// //   tableName: 'commerce_subscription',
// //   properties: (p) => ({
// //     id: p.uuid().primary().onCreate(uuidv7),
// //     organizationId: p.uuid().index(),
// //     planPrice: p.manyToOne(() => SubscriptionPlanPriceEntitySchema),
// //     status: p.enum(SUBSCRIPTION_STATUSES).default('trialing').index(),
// //     currentPeriodStart: p.datetime(),
// //     currentPeriodEnd: p.datetime(),
// //     nextBillingAt: p.datetime().nullable(),
// //     cancelAtPeriodEnd: p.boolean().default(false),
// //     orders: p.oneToMany(() => OrderEntitySchema, (o) => o.subscription),
// //     createdAt: p.datetime().onCreate(() => new Date()),
// //     updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
// //   }),
// // });
