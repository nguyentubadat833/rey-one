// import { InitPaymentInput, PaymentMethod } from '@rey-one/shared';
// export interface PaymentInitResult {
//   orderCode: string;
//   paymentCode: string;
//   [key: string]: unknown; // mỗi provider có thể trả thêm field riêng
// }

// export interface SepayGatewayStrategy extends PaymentInitResult {
//   checkoutUrl: string;
//   fields: object;
// }

// export interface SepayQRCodeStrategy extends PaymentInitResult {
//   qrUrl: string;
// }

// export class SepayGatewayStrategy {}
// export class SepayQRCodeStrategy {}

// export interface PaymentStrategy {
//   readonly method: PaymentMethod;

//   initPayment(params: InitPaymentInput): Promise<PaymentInitResult>;
// }
