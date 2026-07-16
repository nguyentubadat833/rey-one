import { registerAs } from "@nestjs/config";
import z from "zod";

const coursesBucket = 'courses' as const
const usersBucket = 'users' as const

const defaultBuckets = [
    coursesBucket,
    usersBucket
] as const

const schema = z.object({
    S3_REGION: z.string().default("us-east-1"),
    S3_ENDPOINT: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_COURSE_BUCKET: z.string().default(coursesBucket),
})

export const storageConfig = registerAs('storage', () => {
    const parsed = schema.parse(process.env);

    return {
        region: parsed.S3_REGION,
        endpoint: parsed.S3_ENDPOINT,
        accessKey: parsed.S3_ACCESS_KEY,
        secretKey: parsed.S3_SECRET_KEY,
        coursesBucket: parsed.S3_COURSE_BUCKET,
        defaultBuckets: defaultBuckets
    };
});