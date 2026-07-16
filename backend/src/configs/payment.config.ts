import { registerAs } from '@nestjs/config';
import z from 'zod';

const schema = z.object({
  PAYMENT_SEPAY_ENV: z.enum(['production', 'sandbox']).default('sandbox'),
  PAYMENT_SEPAY_MERCHANT_ID: z.string(),
  PAYMENT_SEPAY_MERCHANT_SECRET_KEY: z.string(),
  PAYMENT_SEPAY_BANK_HOLDER: z.string().default('NGUYEN TU BA DAT'),
  PAYMENT_SEPAY_BANK_ACC: z.string().default('09659048330'),
  PAYMENT_SEPAY_BANK_NAME: z.string().default('TPBank'),
  PAYMENT_SEPAY_BANK_VA: z.string().default('ND1'),
  PAYMENT_CONTENT_PREFIX: z.string().default('DH')
});

export const paymentConfig = registerAs('payment', () => {
  const parsed = schema.parse(process.env);

  return {
    contentPrefix: parsed.PAYMENT_CONTENT_PREFIX,
    sepay: {
      env: parsed.PAYMENT_SEPAY_ENV,
      merchantId: parsed.PAYMENT_SEPAY_MERCHANT_ID,
      merchantSecretKey: parsed.PAYMENT_SEPAY_MERCHANT_SECRET_KEY,
      bank: {
        bkHolder: parsed.PAYMENT_SEPAY_BANK_HOLDER,
        bkAcc: parsed.PAYMENT_SEPAY_BANK_ACC,
        bkName: parsed.PAYMENT_SEPAY_BANK_NAME,
        bkVACode: parsed.PAYMENT_SEPAY_BANK_VA
      }
    },
  };
});
