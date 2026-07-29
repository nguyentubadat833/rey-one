import { AppError } from './app.error';

export const DomainNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain not found');
export const DomainMemberNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain member not found');
export const DomainRoleNotFound = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain role not found');

export const InvalidDomainStatus = () => AppError.withMessage('INVALID_STATUS', 'Invalid domain status');
