import { AppError } from "./app.error";

export const UserNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'User not found');
export const InvalidUserStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid user status')