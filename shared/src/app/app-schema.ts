import z from "zod"

export const apiMetaSchema = z.object({
    time: z.ZodISODateTime,
    path: z.string()
})

export const apiErrorSchema = z.object({
    statusCode: z.number(),
    message: z.string(),
    errorKey: z.string().optional()
})

export const apiErrorResponseSchema = z.object({
    error: apiErrorSchema,
    meta: apiMetaSchema
})

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T = z.unknown() as unknown as T) =>
    z.object({
        data: dataSchema,
        meta: apiMetaSchema,
    })

export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<z.ZodType<T>>>>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>