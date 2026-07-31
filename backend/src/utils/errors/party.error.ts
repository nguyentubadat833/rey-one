import { AppError } from './app.error';

export const PartyNotFoundError = () => AppError.withMessage('OBJECT_NOT_FOUND', 'Party not found');
