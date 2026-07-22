// import z from "zod";
// import { USER_STATUSES, USER_TYPES } from "./user.constant";

// export const UserInfoSchema = z.object({
//     name: z.string(),
//     taxCode: z.string().nullable().optional(),
//     phoneg: z.string().nullable().optional(),
//     website: z.string().nullable().optional(),
//     address: z.string().nullable().optional(),
// })

// export const UserSchema = z.object({
//     id: z.uuid(),
//     type: z.enum(USER_TYPES),
//     email: z.string().nullable().optional(),
//     password: z.string().nullable().optional(),
//     status: z.enum(USER_STATUSES),
//     info: UserInfoSchema
// })

// export const CreateUserSchema = UserSchema.omit({
//     id: true
// })

// export const UpdateUserSchema = UserSchema.omit({
//     id: true,
//     email: true,
//     password: true
// })
