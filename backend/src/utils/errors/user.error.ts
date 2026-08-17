import { AppError } from "./app.error";

export const UserNotFoundError = () => AppError.withMessage('NOT_FOUND', 'User not found');
export const InvalidUserStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid user status')
export const InvalidUserScopeError = (message: string) => AppError.withMessage('INVALID_USER_SCOPE', message)