import { AppError } from "./app.error";

export const OrderNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Order not found');