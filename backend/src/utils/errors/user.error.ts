import { AppError } from "./app.error";

export const UserNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'User not found');
export const InvalidUserStatus = () => AppError.withMessage('INVALID_STATUS', 'Invalid user status')