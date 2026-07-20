import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { USER_STATUSES, UserStatus } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';
import { OAuthCredential } from './iam.oauth-credential-entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { hash, verify } from 'argon2';

const UserEntitySchema = defineEntity({
  name: 'IAMUser',
  tableName: 'iam_user',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    oauthCredentials: () => p.oneToMany(OAuthCredential).mappedBy((c) => c.user),
    email: p.string().length(255).unique(),
    password: p.string().length(255).hidden().lazy().ref().nullable(),
    status: p.enum(() => USER_STATUSES),
    isVerified: p.boolean().default(false).fieldName('is_verified'),
    failedLoginAttempts: p.integer().nullable().fieldName('failed_login_attempts'),
    lastFailedLoginAttemptAt: p.datetime().nullable().fieldName('last_failed_login_attempt_at'),
    lastSuccessfulLoginAt: p.datetime().nullable().fieldName('last_successful_login_at'),
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
    const passwordHashed = await this.password.load()

    if(!passwordHashed){
      throw new AppError('PASSWORD_HASHED_NOT_FOUND')
    }

    return verify(passwordHashed, password);
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

UserEntitySchema.addHook('beforeCreate', hashPassword);
UserEntitySchema.addHook('beforeUpdate', hashPassword);

async function hashPassword(args: EventArgs<User>) {
  const password = args.changeSet?.payload.password;

  if (typeof password === 'string') {
    const hashed = await hash(password);
    args.entity.password.set(hashed)
  }
}
