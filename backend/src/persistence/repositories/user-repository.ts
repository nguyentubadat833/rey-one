import { User } from '@/persistence/entities/iam.user-entity';
import { AppError } from '@/utils/errors/app.error';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserOrganizationWithGroup } from '../types/user.type';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  static toObject(user: User) {
    return wrap(user).toObject(['password', 'group']);
  }

  async findOrganizations(): Promise<UserOrganizationWithGroup[]> {
    return this.em.find(
      User,
      {
        type: 'organization',
      },
      {
        populate: ['group', 'info'],
      },
    );
  }

  async findOrganizationById(orgId: string) {
    return this.em.findOne(
      User,
      {
        type: 'organization',
        id: orgId,
      },
      {
        populate: ['group'],
      },
    );
  }

  async findOrganizationMembers(orgId: string) {
    
  }

  async getProfileById(id: string) {
    return this.findOneOrFail(
      { id },
      {
        populate: ['info.name'],
        failHandler: () => new AppError('USER_NOT_FOUND'),
      },
    );
  }

  async authenticateByPassword(email: string, password: string) {
    const err = new AppError('INVALID_CREDENTIAL');
    const user = await this.findOneOrFail(
      { email },
      {
        populate: ['auth.failedLoginAttempts', 'auth.lastFailedLoginAttemptAt', 'auth.lastSuccessfulLoginAt', 'auth.token', 'info.name'],
        failHandler: () => err,
      },
    );

    if (await user.verifyPassword(password)) {
      return user;
    } else {
      await this.recordFailedAuthentication(user);
    }

    throw err;
  }

  async recordFailedAuthentication(user: User) {
    user.auth.failedLoginAttempts = user.auth.failedLoginAttempts ? user.auth.failedLoginAttempts + 1 : 1;
    user.auth.lastFailedLoginAttemptAt = new Date();

    await this.save(user);
  }

  async recordSuccessfulAuthentication(user: User) {
    user.auth.failedLoginAttempts = 0;
    user.auth.lastFailedLoginAttemptAt = null;
    user.auth.lastSuccessfulLoginAt = new Date();

    await this.save(user);
  }

  async save(user: User) {
    this.em.persist(user);
    return this.em.flush();
  }
}
