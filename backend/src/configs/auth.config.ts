import { registerAs } from '@nestjs/config';
import { NodeEnvSchema } from './app.config';
import z from 'zod';

const schema = z
  .object({
    NODE_ENV: NodeEnvSchema,
    COOKIE_SECRET: z.string().min(10).default('123456789a'),
    JWT_SECRET: z.string().min(10).default('123456789a'),
    JWT_ACCESS_EXPIRES_IN_MINUTES: z.coerce.number().positive().int().default(15),
    JWT_REFRESH_EXPIRES_IN_MINUTES: z.coerce.number().positive().int().default(10080), // 7d
    USER_DEFAULT_ADMIN_IDENTITY: z.string().default('admin'),
    USER_DEFAULT_ADMIN_PASSWORD: z.string().default('admin'),
    USER_DEFAULT_PASSWORD: z.string().default('user')
  })
  .superRefine((val, ctx) => {
    if (process.env.NODE_ENV === 'production' && val.JWT_SECRET === '123456789a') {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message: 'Invalid JWT_SECRET for production',
      });
    }
  });

export const authConfig = registerAs('auth', () => {
  const parsed = schema.parse(process.env);

  return {
    cookieSecret: parsed.COOKIE_SECRET,
    jwtSecret: parsed.JWT_SECRET,
    jwtAccessExpiresIn: parsed.JWT_ACCESS_EXPIRES_IN_MINUTES,
    jwtRefreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN_MINUTES,
    userDefault: {
      password: parsed.USER_DEFAULT_PASSWORD,
      admin: {
        identity: parsed.USER_DEFAULT_ADMIN_IDENTITY,
        password: parsed.USER_DEFAULT_ADMIN_PASSWORD
      }
    }
  };
});
