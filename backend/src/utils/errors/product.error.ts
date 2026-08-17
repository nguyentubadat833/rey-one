import { AppError } from "./app.error";

export const ProductNotFoundError = () => AppError.withMessage('NOT_FOUND', 'Product not found');
export const InvalidProductStatusError = () => AppError.withMessage('INVALID_STATUS', "Invalid product status")