import { AppError } from "./app.error";

export const ProductNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Product not found');