import { AppError } from './app.error';

export const DomainNotFoundError = () => AppError.withMessage('NOT_FOUND', 'Domain not found');
export const DomainRequiredError = () => AppError.withMessage('MISSING_DOMAIN_CONTEXT', 'Domain is required in the request');
export const InvalidDomainStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid domain status');