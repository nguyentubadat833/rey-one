import { defineEntity, EntityDTO, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission, USER_STATUSES, USER_TYPES, UserStatus, UserType } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { OAuthCredential } from './iam.oauth-credential-entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserGroup } from './iam.user-group-entity';
import { UserRepository } from '../repositories/user-repository';
import { Product } from './catalog.product-entity';
import { th } from 'zod/v4/locales';

const org = 'organization' satisfies UserType;

// User Info
export const UserInfoSchema = defineEntity({
  name: 'IAMUserInfo',
  embeddable: true,
  properties: {
    name: p.string().length(255),
    taxCode: p.string().length(50).fieldName('tax_code').nullable(),
    phone: p.string().length(30).nullable(),
    website: p.string().length(255).nullable(),
    address: p.string().length(255).nullable(),
  },
});

export class UserInfo extends UserInfoSchema.class {}
UserInfoSchema.setClass(UserInfo);

// User Auth
const UserAuthSchema = defineEntity({
  name: 'IAMUserAuth',
  embeddable: true,
  properties: {
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at'),
    lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at'),
    token: p.string().persist(false).nullable(),
  },
});

export class UserAuth extends UserAuthSchema.class {}
UserAuthSchema.setClass(UserAuth);

// User Entity
const UserEntitySchema = defineEntity({
  name: 'IAMUser',
  tableName: 'iam_user',
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    type: p.enum(() => USER_TYPES),
    oauthCredentials: () =>
      p
        .oneToMany(OAuthCredential)
        .mappedBy((c) => c.user)
        .orphanRemoval()
        .lazyRef(),
    email: p.string().length(255).unique().nullable(),
    password: p.string().length(255).nullable().hidden().lazy().ref(),
    status: p.enum(() => USER_STATUSES).default('active' satisfies UserStatus),
    isVerified: p.boolean().default(false).fieldName('is_verified'),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
    group: () => p.manyToOne(UserGroup).lazy().ref(),
    auth: () =>
      p
        .embedded(UserAuthSchema)
        .onCreate(() => new UserAuth())
        .lazy(),
    info: () => p.embedded(UserInfoSchema).lazy(),
    products: () => p.oneToMany(Product).mappedBy((prd) => prd.owner),
  },
});
export class User extends UserEntitySchema.class {
  static statusAllowedTransitions: Record<UserStatus, UserStatus[]> = {
    pending: ['active', 'deleted'], // verify email hoặc tự xóa
    active: ['inactive', 'banned', 'deleted'],
    inactive: ['active', 'deleted'], // có thể quay lại active
    banned: ['deleted'], // banned không thể active lại
    deleted: [], // không thể đổi gì nữa
  };

  static ensureExists(user: User | null): asserts user is User {
    if (!user) {
      throw new AppError('USER_NOT_FOUND');
    }
  }

  static ensureActive(user: User) {
    if (user.status !== 'active') {
      throw new AppError('INVALID_USER_STATUS');
    }
  }

  static ensureOrganization(user: User) {
    if (user.type !== org) {
      throw new AppError('USER_NOT_ORGANIZATION');
    }
  }

  isOrganization() {
    return this.type === org;
  }

  isActive() {
    return this.status === 'active';
  }

  async verifyPassword(password: string) {
    const passwordHashed = await this.password.load();

    if (!passwordHashed) {
      throw new AppError('USER_PASSWORD_NOT_INITIALIZED');
    }

    return verify(passwordHashed, password);
  }
}

UserEntitySchema.setClass(User);

UserEntitySchema.addHook('beforeCreate', createHandler);
UserEntitySchema.addHook('beforeUpdate', updateHandler);

function createHandler(args: EventArgs<User>) {
  identityHandler(args);
}

function updateHandler(args: EventArgs<User>) {
  identityHandler(args);

  if (args.entity.email && args.changeSet?.payload.email) {
    throw new AppError('USER_EMAIL_IMMUTABLE');
  }

  if (args.entity.isOrganization() && args.changeSet?.payload.group) {
    throw new AppError('USER_ORGANIZATION_GROUP_IMMUTABLE');
  }
}

async function identityHandler(args: EventArgs<User>) {
  const password = args.changeSet?.payload.password;
  const permissions = args.changeSet?.payload.permissions;

  if (typeof password === 'string') {
    const hashed = await hash(password);
    args.entity.password.set(hashed);
  }

  if (permissions) {
    const group = await args.entity.group.loadOrFail();
    group.ensurePermissionsValid(args.entity.permissions);
  }
}

export type UserObject = EntityDTO<Omit<User, 'password'>>;
