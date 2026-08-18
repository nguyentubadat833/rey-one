import { Currency } from '@rey-one/shared';
import { AppError } from './app.error';

export const PaymentNotFoundError = () => new AppError('NOT_FOUND');
export const SepayUnsupportedCurrencyError = (unsupportCurrency: Currency) => AppError.withMessage('UNSUPPORTED_CURRENCY', `Unsupport ${unsupportCurrency}`);
export const PaymentAlreadyProcessingError = () => AppError.withMessage('INVALID_STATUS', 'The payment has already been processing');
export const PaymentAlreadySucceededError = () => AppError.withMessage('INVALID_STATUS', 'The payment has already been succeeded');
