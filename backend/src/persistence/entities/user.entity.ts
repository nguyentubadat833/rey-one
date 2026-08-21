import { ChangeSetType, defineEntity, EventArgs, InferEntity, p } from '@mikro-orm/core';
import {
  USER_STATUSES,
  UserStatus,
  UserScopeSchema,
  UserPermissions,
  SystemUserPermissionsSchema,
  DomainUserPermissionsSchema,
  DomainPermission,
  SystemPermission,
  UserScope,
  DomainStaffUserScopeSchema,
} from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { UserRepository } from '../repositories/user-repository';
import { hash } from 'argon2';
import { uuidv7 } from 'uuidv7';
import { BaseEntitySchema } from './base.entity';
import { InvalidUserScopeError, InvalidUserStatusError, UserNotFoundError } from '@/utils/errors/user.error';
import { Domain } from './domain.entity';
import { UserLoadedDomain } from '../types/user-type';
import randomstring from 'randomstring';
import { Order } from './order.entity';
import { Role } from './role.entity';
import z from 'zod';

type DomainStaffScope = z.infer<typeof DomainStaffUserScopeSchema>;

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

// const UserInfoEntitySchema = defineEntity({
//   name: 'UserInfoEntity',
//   tableName: 'user_info',
//   properties: (p) => ({
//     user: () => p.oneToOne(User).primary().owner(),

//     name: p.string(),
//     image: p.string().nullable(),
//   }),
// });

// export class UserInfo extends UserInfoEntitySchema.class {}
// UserInfoEntitySchema.setClass(UserInfo);

const UserEntitySchema = defineEntity({
  name: 'UserEntity',
  tableName: 'user',
  extends: BaseEntitySchema,
  repository: () => UserRepository,
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    code: p.string().length(15).unique().onCreate(generateCode),
    name: p.string(),
    image: p.string().nullable(),
    username: p.string().unique().nullable(),
    email: p.string().unique().nullable(),
    phone: p.string().unique().nullable(),
    status: p.enum(USER_STATUSES).default('active'),
    password: p.string().hidden().lazy().ref(),
    token: p.string().persist(false).nullable(),
    security: p.embedded(UserSecurityShema).onCreate(() => new UserSecurity()),

    domain: () => p.manyToOne(Domain).nullable().mapToPk(),
    role: () => p.manyToOne(Role).nullable().eager(),
    orders: () => p.oneToMany(Order).mappedBy((order) => order.customer),

    isSystemBoss: p.boolean().persist(false),
    isDomainCustomer: p.boolean().persist(false),
    isDomainStaff: p.boolean().persist(false),
    isDomainBoss: p.boolean().persist(false),
  },
});

export type IUser = InferEntity<typeof UserEntitySchema>;

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

  static parseScope(user: IUser): UserScope {
    const domainId = user.domain;

    if (domainId) {
      if (user.role) {
        return {
          type: 'domain_staff',
          domainId,
          access: {
            permissions: user.role.permissions as DomainPermission[],
            isBoss: user.role.isBoss,
          },
        };
      } else {
        return {
          type: 'domain_customer',
          domainId,
        };
      }
    } else {
      return {
        type: 'system',
        permissions: (user.role?.permissions as SystemPermission[]) ?? [],
        isBoss: user.role?.isBoss ?? false,
      };
    }
  }
}

UserEntitySchema.setClass(User);
UserEntitySchema.addHook('beforeCreate', saveHandler);
UserEntitySchema.addHook('beforeUpdate', saveHandler);
UserEntitySchema.addHook('onLoad', (args) => {
  const scope = User.parseScope(args.entity);

  args.entity.isSystemBoss = scope.type === 'system' && scope.isBoss;
  args.entity.isDomainCustomer = scope.type === 'domain_customer';

  if ((scope.type = 'domain_staff')) {
    const domainStaffScope = scope as DomainStaffScope;
    args.entity.isDomainStaff = true;
    args.entity.isDomainBoss = domainStaffScope.access.isBoss;
  }
});

async function saveHandler(args: EventArgs<User>) {
  const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

  if (!changeSetType) return;

  const entity = args.entity;
  const orignalEntity = args.changeSet?.originalEntity
  const changeSet = args.changeSet?.payload;

  const changeEmail = changeSet?.email;
  const changeUsername = changeSet?.username;
  const changePhone = changeSet?.phone;
  const changePassword = args.changeSet?.payload.password;
  // const changeDomain = args.changeSet?.payload.domain;

  if (changeSetType === ChangeSetType.CREATE) {
    if (!entity.isDomainCustomer && !changeEmail && !changeUsername && !changePhone) {
      throw AppError.withMessage('PROPERTY_REQUIRED', 'At least one of email, username, or phone is required');
    }
  }

  if (changeSetType === ChangeSetType.UPDATE) {
    if (changeEmail && changeEmail !== entity.email && entity.security.emailVerified) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified email cannot be changed');
    }

    if (changePhone && changePhone !== entity.phone && entity.security.phoneVerified) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Verified phone cannot be changed');
    }

    if (changeUsername && changeUsername !== entity.username) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Username cannot be changed');
    }

    if (orignalEntity && orignalEntity.domain !== entity.domain) {
      throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Domain cannot be changed');
    }
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
