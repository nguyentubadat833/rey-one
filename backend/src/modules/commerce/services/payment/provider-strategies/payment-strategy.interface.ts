import { OrderLoadedCustomer } from '@/persistence/types/order-type';
import { InitPaymentConfig, PaymentMethod, PaymentProvider } from '@rey-one/shared';

export interface PaymentInitResult {
  // provider: PaymentProvider
  // method: PaymentMethod;

  [key: string]: unknown; // mỗi provider có thể trả thêm field riêng
}

export interface SepayGatewayPaymentInitResult extends PaymentInitResult {
  checkoutUrl: string;
}

export interface SepayQRCodePaymentInitResult extends PaymentInitResult {
  qrUrl: string;
  orderId: string;
  paymentCode: string;
  bankAccount: string;
  bankName: string;
}

export interface PaymentStrategy {
  readonly provider: PaymentProvider
  readonly method: PaymentMethod

  // initPayment(order: OrderLoadedCustomer, config: InitPaymentConfig): Promise<PaymentInitResult>;
  initPayment(order: OrderLoadedCustomer, config: InitPaymentConfig): Promise<PaymentInitResult>;
}
