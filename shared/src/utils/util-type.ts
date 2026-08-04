export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const META_UI_COMPONENTS = [
  "text",
  "number",
  "select",
  "multi-select",
  "image",
  "date",
  "boolean-check",
] as const;
export type MetaUIComponent = (typeof META_UI_COMPONENTS)[number];

export type MetaUI = {
  label: string;
  hidden?: boolean;
  readonly?: boolean;
  placeholder?: string;
  component: MetaUIComponent;
  className?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};