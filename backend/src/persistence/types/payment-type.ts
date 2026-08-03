import { Loaded } from '@mikro-orm/core';
import { Payment } from '../entities/commerce-payment.entity';

export type PaymentLoadedOrder = Loaded<Payment, 'order'>;
