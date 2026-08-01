import { Injectable } from '@nestjs/common';
import { SepayPaymentBaseStrategy } from './sepay-base.strategy';
import { PaymentMethod, PaymentProvider } from '@rey-one/shared';
import { Order } from '@/persistence/entities/commerce-order.entity';
import { PaymentStrategy, SepayQRCodePaymentInitResult } from '../provider-strategies/payment-strategy.interface';
import { AppError } from '@/utils/errors/app.error';

@Injectable()
export class SepayQRcodeBankTransferStrategy extends SepayPaymentBaseStrategy implements PaymentStrategy {
    readonly provider: PaymentProvider = 'sepay';
    readonly method: PaymentMethod = 'sepay_qrcode_bank_transfer';


    async initPayment(order: Order): Promise<SepayQRCodePaymentInitResult> {
        if (order.currency !== 'VND') {
            throw new AppError('SEPAY_UNSUPPORTED_CURRENCY');
        }

        // if (order.payment?.method !== this.method) {
        //   void this.cancelOrder(order.id);
        // }

        const paymentCode = `${this.config.contentPrefix}${order.code}`;
        const amount = Number(order.totalAmount);

        const baseURL = new URL('https://vietqr.app/img');
        baseURL.searchParams.set('acc', this.config.sepay.bank.bkAcc);
        baseURL.searchParams.set('bank', this.config.sepay.bank.bkName);
        baseURL.searchParams.set('amount', amount.toString());
        baseURL.searchParams.set('des', `TKP${this.config.sepay.bank.bkVACode}` + ' ' + `${paymentCode}`);
        baseURL.searchParams.set('showinfo', 'true');
        baseURL.searchParams.set('fullacc', 'true');
        baseURL.searchParams.set('holder', this.config.sepay.bank.bkHolder);
        baseURL.searchParams.set('compact', 'true');

        return {
            provider: this.provider,
            method: this.method,
            qrUrl: baseURL.toString(),
            bankAccount: this.config.sepay.bank.bkAcc,
            bankName: this.config.sepay.bank.bkName,
            orderId: order.id,
            amount,
            paymentCode,
        };
    }
}
