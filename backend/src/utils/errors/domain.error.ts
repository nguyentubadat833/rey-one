import { BadRequestException } from '@nestjs/common';
import { AppError } from './app.error';

export const DomainNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain not found');
export const DomainMemberNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain member not found');
export const DomainRoleNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Domain role not found');

export const InvalidDomainStatusError = () => AppError.withMessage('INVALID_STATUS', 'Invalid domain status');

export const DomainRequiredError = () => new BadRequestException("Domain ID is required")