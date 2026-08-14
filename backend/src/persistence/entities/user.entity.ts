import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { USER_STATUSES, UserStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { UserRepository } from '../repositories/user-repository';
import { hash } from 'argon2';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { InvalidUserStatusError, UserNotFoundError } from '@/utils/errors/user.error';
import { Role } from './role.entity';
import randomstring from 'randomstring';

const UserSecurityShema = defineEntity({
  name: 'UserAuditEntity',
  embeddable: true,
  properties: (p) => ({
    emailVerified: p.boolean().default(false).fieldName('email_verified'),
    phoneVerified: p.boolean().default(false).fieldName('phone_verified'),
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    lastFailedLoginAt: p.datetime().nullable().fieldName('last_failed_login_at'),
    lastLoginAt: p.datetime().nullable().fieldName('last_login_at'),
  }),
});

class UserSecurity extends UserSecurityShema.class {}
UserSecurityShema.setClass(UserSecurity);

const UserInfoEntitySchema = defineEntity({
  name: 'UserInfoEntity',
  tableName: 'user_info',
  properties: (p) => ({
    user: () => p.oneToOne(User).primary().owner(),

    name: p.string(),
    image: p.string().nullable(),
  }),
});

export class UserInfo extends UserInfoEntitySchema.class {}
UserInfoEntitySchema.setClass(UserInfo);

const UserEntitySchema = defineEntity({
  name: 'UserEntity',
  tableName: 'user',
  extends: BaseEntitySchema,
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateCode),
    username: p.string().unique().nullable(),
    email: p.string().unique().nullable(),
    phone: p.string().unique().nullable(),
    status: p.enum(USER_STATUSES).default('active'),
    password: p.string().hidden().lazy().ref(),
    token: p.string().persist(false).nullable(),

    security: p.embedded(UserSecurityShema).onCreate(() => new UserSecurity()),

    info: () => p.oneToOne(UserInfoEntitySchema).mappedBy((info) => info.user),
    role: () => p.manyToOne(Role).ref(),
  },
});

export class User extends UserEntitySchema.class {
  static statusAllowedTransitions: Record<UserStatus, UserStatus[]> = {
    pending: ['active'], // verify hoặc tự xóa
    active: ['inactive', 'banned'],
    inactive: ['active'], // có thể quay lại active
    banned: [], // banned không thể active lại
  };

  static ensureExists(user: User | null): asserts user is User {
    if (!user) {
      throw UserNotFoundError();
    }
  }

  static ensureActive(user: User) {
    if (user.status !== 'active') {
      throw InvalidUserStatusError();
    }
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

  const changeRole = args.changeSet?.payload.role;
  const changeDomain = args.changeSet?.payload.domain;

  if (changeSetType === ChangeSetType.CREATE) {
    if (!changeEmail && !changeUsername && !changePhone) {
      throw AppError.withMessage('PROPERTY_REQUIRED', 'At least one of email, username, or phone is required');
    }
  }

  if (changeSetType === ChangeSetType.UPDATE) {
    if (changeEmail && entity.security.emailVerified) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified email cannot be changed');
    }

    if (changePhone && entity.phone) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified phone cannot be changed');
    }

    if (changeUsername) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Username cannot be changed');
    }
  }

  if (changeRole || changeDomain) {
  }

  if (typeof changePassword === 'string') {
    const hashed = await hash(changePassword);
    entity.password.set(hashed);
  }
}

function generateCode() {
  const string = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
  });
  return `USR${string}`;
}
