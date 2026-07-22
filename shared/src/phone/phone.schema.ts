import { z } from 'zod';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const zPhoneNumber = (defaultCountry: CountryCode = 'VN') =>
  z.string().transform((val, ctx) => {
    const phone = parsePhoneNumberFromString(val, defaultCountry);
    if (!phone || !phone.isValid()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Số điện thoại không hợp lệ',
      });
      return z.NEVER;
    }
    return phone.number;
  });