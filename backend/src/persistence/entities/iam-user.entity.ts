import { ChangeSetType, defineEntity, EntityDTO, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission, USER_STATUSES, USER_TYPES, UserStatus, UserType } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { OAuthCredential } from './iam-user.oauth-credential.entity';
import { hash, verify } from 'argon2';
import { UserRepository } from '../repositories/user-repository';
import { DomainMember } from './iam-domain.member.entity';
import { BaseCredential } from './iam-user.base-credential.entity';

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

export class UserInfo extends UserInfoSchema.class { }
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

export class UserAuth extends UserAuthSchema.class { }
UserAuthSchema.setClass(UserAuth);

// User Entity
const UserEntitySchema = defineEntity({
  name: 'IAMUser',
  tableName: 'iam_user',
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    type: p.enum(() => USER_TYPES),
    baseCredential: () => p.oneToOne(BaseCredential).owner()
      .nullable()
      .joinColumn('base_credential_id')
      .orphanRemoval()
      .ref(),
    oauthCredentials: () =>
      p
        .oneToMany(OAuthCredential)
        .mappedBy((c) => c.user)
        .orphanRemoval()
        .ref(),
    status: p.enum(USER_STATUSES).default('active' satisfies UserStatus),
    isVerified: p.boolean().default(false).fieldName('is_verified'),
    auth: () =>
      p
        .embedded(UserAuthSchema)
        .onCreate(() => new UserAuth())
        .lazy(),
    info: () => p.embedded(UserInfoSchema).lazy(),
    members: () =>
      p
        .oneToMany(DomainMember)
        .mappedBy((member) => member.user)
        .orphanRemoval()
        .lazy()
        .ref(),
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
      throw AppError.withMessage('OBJECT_NOT_FOUND', 'User not found');
    }
  }

  static ensureActive(user: User) {
    if (user.status !== 'active') {
      throw AppError.withMessage('INVALID_STATUS', 'Invalid user status');
    }
  }

  isActive() {
    return this.status === 'active';
  }

  async loadDomainAccess() {
    const members = await this.members.load();

    const result: Record<string, AppPermission[]> = {};

    members.getItems().forEach((item) => {
      result[item.domain.id] = item.role?.permissions ?? [];
    });

    return result
  }
}

UserEntitySchema.setClass(User);

UserEntitySchema.addHook('beforeCreate', saveHandler);
UserEntitySchema.addHook('beforeUpdate', saveHandler);

async function saveHandler(args: EventArgs<User>) {
  // const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

  // if (!changeSetType) return;

  // const changeSetPassword = args.changeSet?.payload.password;
  // if (typeof changeSetPassword === 'string') {
  //   const hashed = await hash(changeSetPassword);
  //   args.entity.password.set(hashed);
  // }

  // if (changeSetType === ChangeSetType.UPDATE) {
  //   if (args.changeSet?.payload.email && args.changeSet.originalEntity?.email) {
  //     throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Email immutable');
  //   }
  // }
}
