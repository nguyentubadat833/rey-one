import { Loaded } from "@mikro-orm/core";
import { Order } from "../entities/order.entity";

export type OrderLoadedCustomerAndCreatedBy = Loaded<Order, 'createdBy.info' | 'customer.info'>
export type OrderLoadedDomainAndCustomerAndPayments = Loaded<Order, 'domain' | 'createdBy.info' | 'customer.info' | 'payments'>