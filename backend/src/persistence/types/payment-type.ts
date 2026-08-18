import { Loaded } from "@mikro-orm/core";
import { Payment } from "../entities/payment.entity";

export type PaymentLoadedOrder = Loaded<Payment, 'order'>