export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};