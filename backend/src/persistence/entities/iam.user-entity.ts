import { defineEntity, EntityDTO, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission, USER_STATUSES, USER_TYPES, UserStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { OAuthCredential } from './iam.oauth-credential-entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserGroup } from './iam.user-group-entity';
import { UserRepository } from '../repositories/user-repository';

// User Info
export const UserInfoSchema = defineEntity({
  name: 'IAMUserInfo',
  embeddable: true,
  properties: {
    name: p.string().length(255).lazy(),
    taxCode: p.string().length(50).fieldName('tax_code').nullable().lazy(),
    email: p.string().length(255).nullable().lazy(),
    phone: p.string().length(30).nullable().lazy(),
    website: p.string().length(255).nullable().lazy(),
    address: p.string().length(255).nullable().lazy(),
  },
});

export class UserInfo extends UserInfoSchema.class {}
UserInfoSchema.setClass(UserInfo);

// User Auth
const UserAuthSchema = defineEntity({
  name: 'IAMUserAuth',
  embeddable: true,
  properties: {
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts').lazy(),
    lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at').lazy(),
    lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at').lazy(),
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
    password: p.string().length(255).hidden().lazy().ref().nullable(),
    status: p.enum(() => USER_STATUSES).default('active' satisfies UserStatus),
    isVerified: p.boolean().default(false).fieldName('is_verified'),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
    group: () => p.manyToOne(UserGroup).lazy().ref(),
    auth: () => p.embedded(UserAuthSchema).onCreate(() => new UserAuth()),
    info: () => p.embedded(UserInfoSchema),
  },
});
export class User extends UserEntitySchema.class {
  declare readonly email: string;

  static statusAllowedTransitions: Record<UserStatus, UserStatus[]> = {
    pending: ['active', 'deleted'], // verify email hoặc tự xóa
    active: ['inactive', 'banned', 'deleted'],
    inactive: ['active', 'deleted'], // có thể quay lại active
    banned: ['deleted'], // banned không thể active lại
    deleted: [], // không thể đổi gì nữa
  };

  static ensureExists(user: User | null): asserts user is User {
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  static ensureActive(user: User) {
    if (user.status !== 'active') {
      throw new ConflictException('Invalid user status');
    }
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

UserEntitySchema.addHook('beforeCreate', saveHandler);
UserEntitySchema.addHook('beforeUpdate', saveHandler);

async function saveHandler(args: EventArgs<User>) {
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
