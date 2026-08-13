import { AppError } from "./app.error"

export const PaymentAlreadyProcessing = () => AppError.withMessage('INVALID_STATUS', "The payment has already been processing")
export const PaymentAlreadySucceeded = () => AppError.withMessage('INVALID_STATUS', "The payment has already been succeeded")