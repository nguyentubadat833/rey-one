import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { USER_ROLES, USER_STATUSES, UserStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { Party } from './iam.party-entity';
import { OAuthCredential } from './iam.oauth-credential-entity';
import { OrganizationMembership } from './iam.organization-membership-entity';

const UserEntitySchema = defineEntity({
  name: 'IAMV2User',
  tableName: 'iam_v2_user',
  properties: {
    party: () => p.oneToOne(Party).owner().primary().joinColumn('id'),
    oauthCredentials: () => p.oneToMany(OAuthCredential).mappedBy((c) => c.user),
    memberships: () => p.oneToMany(OrganizationMembership).mappedBy((org) => org.user),
    email: p.string().length(255).unique(),
    password: p.string().length(255).nullable(),
    status: p.enum(() => USER_STATUSES),
    isVerified: p.boolean().default(false).fieldName('is_verified'),
    role: p.enum(() => USER_ROLES),
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at'),
    lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at'),
  },
});

export type IUser = InferEntity<typeof UserEntitySchema>;

export class User extends UserEntitySchema.class {
  declare readonly email: string;

  static statusAllowedTransitions: Record<UserStatus, UserStatus[]> = {
    pending: ['active', 'deleted'], // verify email hoặc tự xóa
    active: ['inactive', 'banned', 'deleted'],
    inactive: ['active', 'deleted'], // có thể quay lại active
    banned: ['deleted'], // banned không thể active lại
    deleted: [], // không thể đổi gì nữa
  };

  static ensureExists(user: IUser | null): asserts user is IUser {
    if (!user) {
      throw new AppError('USER_NOT_FOUND');
    }
  }

  static ensureActive(user: IUser) {
    if (user.status !== 'active') {
      throw new AppError('INVALID_USER_STATUS');
    }
  }

  isActive() {
    return this.status === 'active';
  }

  // getId() {
  //   const id = helper(this.party).getPrimaryKey();
  //   if (!id) {
  //     throw new BaseError('USER_NOT_FOUND', 'Entity has not been persisted yet.');
  //   }
  //   return id as string;
  // }
}

UserEntitySchema.setClass(User);
