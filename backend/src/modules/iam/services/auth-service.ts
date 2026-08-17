import { UserRepository } from '@/persistence/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BaseLoginDto } from '../dtos/auth-dto';
import { IdentifierType } from '@/persistence/types/user-type';
import { User } from '@/persistence/entities/user.entity';
import { verify } from 'argon2';
import { AppError, SystemNotInitializedError } from '@/utils/errors/app.error';
import { AppClsStore, UserAuth } from '@/utils/types/system';
import { ClsService } from 'nestjs-cls';
import z from 'zod';

const emailSchema = z.email();

@Injectable()
export class AuthService {
  private _adminUser?: UserAuth;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly appStore: ClsService<AppClsStore>,
  ) {}

  static IdentityDetect(raw: string): IdentifierType {
    if (emailSchema.safeParse(raw).success) return { email: raw };

    const phone = parsePhoneNumberFromString(raw, 'VN');
    if (phone?.isValid()) return { phone: phone.number };

    if (z.uuid().safeParse(raw).success) {
      return { id: raw };
    }

    return { username: raw };
  }

  set adminUser(user: UserAuth) {
    this._adminUser = user;
  }

  get adminUser(): UserAuth {
    if (!this._adminUser) {
      throw SystemNotInitializedError('System admin user has not been initialized');
    }

    return this._adminUser;
  }

  getActor() {
    const actor = this.appStore.get('actor');
    if (!actor) throw new AppError('MISSING_ACTOR_CONTEXT');
    
    return actor;
  }

  isActorAdmin() {
    console.log('admin user: ', this.adminUser)
    return this.appStore.get('actor.id') === this.adminUser.id;
  }

  async baseAuthentication(dto: BaseLoginDto) {
    const identity = AuthService.IdentityDetect(dto.identity);

    const user = await this.userRepo.findByIdentity(identity);
    User.ensureExists(user);
    User.ensureActive(user);

    const password = await user.password.load();
    if (!password) {
      throw AppError.withMessage('PROPERTY_NOT_INITIALIZED', 'Password not found');
    }

    const verifyPasswordResult = await verify(password, dto.password);
    if (!verifyPasswordResult) {
      await this.userRepo.recordFailedAuthentication(user);
      throw new AppError('INVALID_CREDENTIAL');
    }

    return {
      user,
      onSuccess: () => this.userRepo.recordSuccessfulAuthentication(user),
    };
  }
}
