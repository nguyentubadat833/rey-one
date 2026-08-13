import { AppError } from "./app.error";

export const OrderNotFoundError = () => AppError.withMessage('NOT_FOUND', 'Order not found');
// export const OrderAlreadyPaid = () => AppError.withMessage('INVALID_STATUS', "The order has already been paid")
export const InvalidOrderStatus = (message: string) => AppError.withMessage('INVALID_STATUS', message)