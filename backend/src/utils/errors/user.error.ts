import { AppError } from "./app.error";

export const UserNotFoundError = () => AppError.withMessage('NOT_FOUND', 'User not found');
export const InvalidUserStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid user status')

export const RoleNotFoundError = () => AppError.withMessage('NOT_FOUND', "Role not found")
export const InvalidRoleStatusError = () => AppError.withMessage('INVALID_STATUS', "Invalid role status")
export const InvalidRoleScopeError = (message: string) => AppError.withMessage('BUSINESS_RULE_VIOLATION', message)