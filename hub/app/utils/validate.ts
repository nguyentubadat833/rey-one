import type z from "zod";

export function zodValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message
    const nuxtApp = useNuxtApp();

    nuxtApp.runWithContext(() => {
      const toast = useToast()

      toast.add({
        title: "Invalid input",
        description: errorMessage,
        color: "error",
        icon: "ic:baseline-error-outline",
      });
    });

    throw new ValidateInputError(errorMessage);
  }

  return result.data;
}
