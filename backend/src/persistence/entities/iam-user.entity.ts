import { ChangeSetType, defineEntity, EntityDTO, EventArgs, p } from '@mikro-orm/core';
import { AppPermission, USER_STATUSES, USER_TYPES, UserStatus, UserType } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { UserRepository } from '../repositories/user-repository';
import { DomainMember } from './iam-domain.member.entity';
import { hash } from 'argon2';
import { Party } from './iam-party.entity';

// User Entity
const UserEntitySchema = defineEntity({
  name: 'IAMUser',
  tableName: 'iam_user',
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    type: p.enum(USER_TYPES),
    username: p.string().unique().nullable(),
    email: p.string().unique().nullable(),
    phone: p.string().unique().nullable(),
    password: p.string().hidden().lazy().ref(),
    status: p.enum(USER_STATUSES).default('active' satisfies UserStatus),
    emailVerified: p.boolean().default(false).fieldName('email_verified'),
    phoneVerified: p.boolean().default(false).fieldName('phone_verified'),
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at'),
    lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at'),
    token: p.string().persist(false).nullable(),
    party: () => p.oneToOne(Party).ref(),
    members: () =>
      p
        .oneToMany(DomainMember)
        .mappedBy((member) => member.user)
        .orphanRemoval()
        .ref(),
  },
});
export class User extends UserEntitySchema.class {
  static statusAllowedTransitions: Record<UserStatus, UserStatus[]> = {
    pending: ['active', 'deleted'], // verify hoặc tự xóa
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

  async loadDomainAccess() {
    const members = await this.members.load();

    const result: Record<string, AppPermission[]> = {};

    members.getItems().forEach((item) => {
      result[item.domain.id] = item.role?.permissions ?? [];
    });

    return result;
  }

  isActive() {
    return this.status === 'active';
  }
}

UserEntitySchema.setClass(User);

UserEntitySchema.addHook('beforeCreate', saveHandler);
UserEntitySchema.addHook('beforeUpdate', saveHandler);

async function saveHandler(args: EventArgs<User>) {
  const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

  if (!changeSetType) return;

  const entity = args.entity;
  const changeSet = args.changeSet?.payload;

  const changeEmail = changeSet?.email;
  const changeUsername = changeSet?.username;
  const changePhone = changeSet?.phone;
  const changePassword = args.changeSet?.payload.password;

  if (changeSetType === ChangeSetType.CREATE) {
    if (!changeEmail && !changeUsername && !changePhone) {
      throw AppError.withMessage('PROPERTY_REQUIRED', 'At least one of email, username, or phone is required');
    }
  }

  if (changeSetType === ChangeSetType.UPDATE) {
    if (changeEmail && entity.emailVerified) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified email cannot be changed');
    }

    if (changePhone && entity.phone) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified phone cannot be changed');
    }

    if (changeUsername) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Username cannot be changed');
    }
  }

  if (typeof changePassword === 'string') {
    const hashed = await hash(changePassword);
    entity.password.set(hashed);
  }
}
