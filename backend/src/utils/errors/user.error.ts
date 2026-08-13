import { AppError } from "./app.error";

export const UserNotFoundError = () => AppError.withMessage('NOT_FOUND', 'User not found');
export const InvalidUserStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid user status')
export const InvalidRoleStatusError = () => AppError.withMessage('INVALID_STATUS', "Invalid role status")