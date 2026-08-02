import { Loaded } from '@mikro-orm/core';
import { Order, OrderItem } from '../entities/commerce-order.entity';

export type OrderLoadedCustomer = Loaded<Order, 'customer'>
export type OrderLoadedCustomerAndDomain = Loaded<Order, 'customer' | 'domain'>
export type OrderLoadedCustomerAndCreatedByAndItems = Loaded<Order, 'customer' | 'createdBy.party' | 'items.product.info'>;
export type OrderItemLoadedProduct = Loaded<OrderItem, 'product.info'>