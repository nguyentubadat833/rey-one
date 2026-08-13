import { User } from '@/persistence/entities/user.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { IdentifierType, UserLoadedRoleWithDomain } from '../types/user-type';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  static toObject(user: User) {
    return wrap(user).toObject(['password']);
  }

  async findByIdentity(identity: IdentifierType): Promise<UserLoadedRoleWithDomain | null> {
    return this.findOne(identity, {
      populate: ['role.domain']
    });
  }

  async recordFailedAuthentication(user: User) {
    user.security.failedLoginAttempts = user.security.failedLoginAttempts ? user.security.failedLoginAttempts + 1 : 1;
    user.security.lastFailedLoginAt = new Date();

    await this.save(user);
  }

  async recordSuccessfulAuthentication(user: User) {
    user.security.failedLoginAttempts = 0;
    user.security.lastFailedLoginAt = null;
    user.security.lastLoginAt = new Date();

    await this.save(user);
  }

  async save(user: User) {
    this.em.persist(user);
    await this.em.flush();
    return user;
  }

}
