import { ChangeSetType, defineEntity, EventArgs, p } from '@mikro-orm/core';
import { USER_STATUSES, UserStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { UserRepository } from '../repositories/user-repository';
import { hash } from 'argon2';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { InvalidUserStatusError, UserNotFoundError } from '@/utils/errors/user.error';
import { Order } from './order.entity';
import { Role } from './role.entity';
import randomstring from 'randomstring';
import { Domain } from 'domain';

const UserInfoSchema = defineEntity({
  name: 'UserInfoEntity',
  embeddable: true,
  properties: (p) => ({
    name: p.string(),
    image: p.string().nullable(),
  }),
});

// User Entity
const UserEntitySchema = defineEntity({
  name: 'UserEntity',
  tableName: 'user',
  extends: BaseEntitySchema,
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateCode),
    // type: p.enum(USER_TYPES),
    username: p.string().unique().nullable(),
    email: p.string().unique().nullable(),
    phone: p.string().unique().nullable(),
    status: p.enum(USER_STATUSES).default('active'),
    password: p.string().hidden().lazy().ref(),
    emailVerified: p.boolean().default(false).fieldName('email_verified'),
    phoneVerified: p.boolean().default(false).fieldName('phone_verified'),
    // failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    // lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at'),
    // lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at'),
    token: p.string().persist(false).nullable(),
    info: p.embedded(UserInfoSchema).lazy(),
  
    domain: () => p.manyToOne(Domain).nullable(),
    role: () => p.manyToOne(Role).nullable()
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

  async loadDomainAccess() {
    // const members = await this.members.load();

    // const result: Record<string, AppPermission[]> = {};

    // members.getItems().forEach((item) => {
    //   result[item.domain.id] = item.role?.permissions ?? [];
    // });

    // return result;
  }

  isActive() {
    return this.status === 'active';
  }

  // isDomainUser() {
  //   return this.type === 'domain_user';
  // }
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
    // entity.party.getEntity().code = generatePartyCode();

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

  // if (entity.type === 'domain_user') {
  //   if (entity.members.count() > 1) {
  //     throw AppError.withMessage('BUSINESS_RULE_VIOLATION', 'A domain user cannot belong to more than one domain.');
  //   }
  // }
}

function generateCode() {
  const string = randomstring.generate({
    length: 12,
    charset: '23456789QWERTYUPASDFGHKLMNBVCXZ',
  });
  return `USR${string}`;
}
