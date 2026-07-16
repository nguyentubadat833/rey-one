import { registerAs } from '@nestjs/config';
import { SYSTEM_SUPER_ADMIN_ROLE, SYSTEM_SUPPORT_ROLE } from '@rey-one/shared';
import { NodeEnvSchema } from './app.config';
import z from 'zod';

const schema = z
  .object({
    NODE_ENV: NodeEnvSchema,
    COOKIE_SECRET: z.string().min(10).default('123456789a'),
    JWT_SECRET: z.string().min(10).default('123456789a'),
    JWT_ACCESS_EXPIRES_IN_MINUTES: z.coerce.number().positive().int().default(15),
    JWT_REFRESH_EXPIRES_IN_MINUTES: z.coerce.number().positive().int().default(10080), // 7d
    SUPER_ADMIN_USERNAME: z.string().default('superadmin'),
    SUPER_ADMIN_PASSWORD: z.string().default('superadmin'),
    SUPER_ADMIN_EMAIL: z.string().default('superadmin@gmail.com'),
    SYSTEM_SUPPORT_USERNAME: z.string().default('support'),
    SYSTEM_SUPPORT_PASSWORD: z.string().default('support'),
    SYSTEM_SUPPORT_EMAIL: z.string().default('support@gmail.com'),
    ORGANIZATION_MEMBERSHIP_DEFAULT_PASSWORD: z.string().default('membership'),
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
    superAdminUser: {
      name: 'Superadmin',
      role: SYSTEM_SUPER_ADMIN_ROLE,

      // remove
      username: parsed.SUPER_ADMIN_USERNAME,

      password: parsed.SUPER_ADMIN_PASSWORD,
      email: parsed.SUPER_ADMIN_EMAIL,
    },
    systemSupportUser: {
      name: 'System support',
      role: SYSTEM_SUPPORT_ROLE,

      // remove
      username: parsed.SYSTEM_SUPPORT_USERNAME,

      password: parsed.SYSTEM_SUPPORT_PASSWORD,
      email: parsed.SYSTEM_SUPPORT_EMAIL,
    },
    organization: {
      membershipDefaultPassword: parsed.ORGANIZATION_MEMBERSHIP_DEFAULT_PASSWORD,
    },
  };
});
