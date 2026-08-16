import z from "zod";
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

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


export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  });

// types
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};