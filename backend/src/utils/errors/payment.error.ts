import { AppError } from "./app.error"

export const PaymentAlreadyProcessing = () => AppError.withMessage('INVALID_PAYMENT_STATUS', "The payment has already been processing")
export const PaymentAlreadySucceeded = () => AppError.withMessage('INVALID_PAYMENT_STATUS', "The payment has already been succeeded")
// export const InvalidPaymentStatus = () => new AppError("INVALID_PAYMENT_STATUS")