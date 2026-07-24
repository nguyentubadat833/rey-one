import { User } from '@/persistence/entities/iam-user.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { IdentifierType } from '../types/user-type';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  static toObject(user: User) {
    return wrap(user).toObject(['password']);
  }

  async findByIdentity(identity: IdentifierType) {
    return this.findOne(identity);
  }

  async recordFailedAuthentication(user: User) {
    user.failedLoginAttempts = user.failedLoginAttempts ? user.failedLoginAttempts + 1 : 1;
    user.lastFailedLoginAttemptAt = new Date();

    await this.save(user);
  }

  async recordSuccessfulAuthentication(user: User) {
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttemptAt = null;
    user.lastSuccessfulLoginAt = new Date();

    await this.save(user);
  }

  async save(user: User) {
    this.em.persist(user);
    await this.em.flush();
    return user;
  }

}
