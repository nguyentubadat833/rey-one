import { AppError } from './app.error';

export const DomainNotFoundError = () => AppError.withMessage('NOT_FOUND', 'Domain not found');

export const InvalidDomainStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid domain status');