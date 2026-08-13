import z from "zod";
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const CURRENCIES = ["VND", "USD"] as const;

// schemas
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

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(20),
});

// types
export type Currency = (typeof CURRENCIES)[number];
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
