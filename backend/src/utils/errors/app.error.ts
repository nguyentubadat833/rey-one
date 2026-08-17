import { ErrorKey } from '@rey-one/shared';

export class AppError extends Error {
  constructor(
    public readonly type: ErrorKey,
    cause?: any,
  ) {
    super(type);
    this.name = this.constructor.name;
    this.cause = cause;
  }

  static withMessage(type: ErrorKey, message: string, cause?: any) {
    const error = new AppError(type, cause);
    error.message = message;
    return error;
  }
}

export const SystemNotInitializedError = (message: string) => AppError.withMessage('UNKNOWN_ERROR', message);
export const InvalidRequestContextError = (message: string) => AppError.withMessage('INVALID_REQUEST_CONTEXT', message);