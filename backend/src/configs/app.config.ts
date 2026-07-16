import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const NodeEnvSchema = z.enum(['development', 'production', 'test']).default('development')

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: NodeEnvSchema,
  ORIGINS: z
    .string()
    .default('http://localhost:4008,http://100.95.91.79:4008,https://test.hub.remika.vn,https://test.remika.vn,https://dev.hub.remika.vn')
    .transform((str) => str.split(',').map((s) => s.trim())),
});

export const appConfig = registerAs('app', () => {
  const parsed = schema.parse(process.env);

  return {
    port: parsed.PORT,
    env: parsed.NODE_ENV,
    origins: parsed.ORIGINS
  };
});
