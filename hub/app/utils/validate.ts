import type z from "zod";

export function zodValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidateInputError(result.error.issues[0]?.message);
  }

  return result.data;
}
