import { registerAs } from "@nestjs/config";
import { z } from "zod";

const schema = z.object({
    DATABASE_URL: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_AUTO_UPDATE: z.coerce.boolean().default(false)
})

export const databaseConfig = registerAs('db', () => {
    const parsed = schema.parse(process.env);

    return {
        databaseURL: parsed.DATABASE_URL,
        dbHost: parsed.DB_HOST,
        dbPort: parsed.DB_PORT,
        dbUser: parsed.DB_USER,
        dbPassword: parsed.DB_PASSWORD,
        dbName: parsed.DB_NAME,
        dbAutoUpdate: parsed.DB_AUTO_UPDATE
    };
});