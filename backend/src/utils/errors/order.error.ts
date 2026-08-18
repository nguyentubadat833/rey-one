import { OrderPaymentType } from "@rey-one/shared";
import { AppError } from "./app.error";

export const OrderNotFoundError = () => AppError.withMessage('NOT_FOUND', 'Order not found');
export const OrderPaymentTypeUnsupported = (type: OrderPaymentType) => AppError.withMessage('PAYMENT_METHOD_NOT_SUPPORTED', `Unsupported order payment type: ${type}`) 
export const InvalidOrderStatus = (message: string) => AppError.withMessage('INVALID_STATUS', message)