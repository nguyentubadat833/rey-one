import { AppError } from "./app.error";

export const OrderNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Order not found');
export const OrderAlreadyPaid = () => AppError.withMessage('INVALID_ORDER_STATUS', "The order has already been paid")
export const InvalidOrderStatus = () => new AppError("INVALID_ORDER_STATUS")