import { AppError } from "./app.error";

export const OrderNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Order not found');