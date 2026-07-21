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
    USER_ADMIN_EMAIL: z.string().default('sysadmin@gmail.com'),
    USER_ADMIN_PASSWORD: z.string().default('sysadmin'),
    USER_SUPPORT_EMAIL: z.string().default('support@gmail.com'),
    USER_SUPPORT_PASSWORD: z.string().default('support'),
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
      admin: {
        group: 'sys_admin',
        email: parsed.USER_ADMIN_EMAIL,
        password: parsed.USER_ADMIN_PASSWORD,
      },
      support: {
        group: 'sys_support',
        email: parsed.USER_SUPPORT_EMAIL,
        password: parsed.USER_SUPPORT_PASSWORD,
      },
    },
  };
});
