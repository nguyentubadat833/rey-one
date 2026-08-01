import { Loaded } from '@mikro-orm/core';
import { Order, OrderItem } from '../entities/commerce-order.entity';

export type OrderLoadedCustomer = Loaded<Order, 'customer'>
export type OrderItemLoadedProduct = Loaded<OrderItem, 'product.info'>
export type OrderLoadedCustomerAndCreatedByAndItems = Loaded<Order, 'customer' | 'createdBy.party' | 'items.product.info'>;