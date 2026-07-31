import { z } from "zod";
export * from "./util-type";

// export const JSONSchema: z.ZodType<
//   string | number | boolean | null | { [key: string]: any } | any[]
// > = z.lazy(() =>
//   z.union([
//     z.string(),
//     z.number(),
//     z.boolean(),
//     z.null(),
//     z.array(JSONSchema),
//     z.record(z.string(), JSONSchema),
//   ]),
// );
