import { UserRepository } from '@/persistence/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BaseLoginDto } from '../dtos/auth-dto';
import { IdentifierType, UserLoadedRoleWithDomain } from '@/persistence/types/user-type';
import { User } from '@/persistence/entities/user.entity';
import { verify } from 'argon2';
import { AppError, SystemNotInitializedError } from '@/utils/errors/app.error';
import z from 'zod';
import { UserAuth } from '@/utils/types/system';

const emailSchema = z.email();

@Injectable()
export class AuthService {
  private _adminUser?: UserAuth;

  constructor(private readonly userRepo: UserRepository) {}

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

  get adminRoleId() {
    return this.adminUser.id;
  }

  isUserAdmin(user: UserAuth) {
    return user.id === this.adminRoleId;
  }

  async baseAuthentication(dto: BaseLoginDto) {
    const identity = AuthService.IdentityDetect(dto.identity);

    const user = await this.userRepo.findByIdentity(identity);
    User.ensureExists(user);
    User.ensureActive(user);

    user.role.getEntity().ensureActive();
    user.role.getProperty('domain')?.getEntity().ensureActive();

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
      user: user as UserLoadedRoleWithDomain,
      onSuccess: () => this.userRepo.recordSuccessfulAuthentication(user),
    };
  }
}
