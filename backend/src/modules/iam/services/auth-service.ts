import { UserRepository } from '@/persistence/repositories/user-repository';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BaseLoginDto } from '../dtos/auth-dto';
import { IdentifierType } from '@/persistence/types/user-type';
import z from 'zod';
import { User } from '@/persistence/entities/iam-user.entity';
import { verify } from 'argon2';
import { AppError } from '@/utils/errors/app.error';

const emailSchema = z.email();

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  static IdentityDetect(raw: string): IdentifierType {
    if (emailSchema.safeParse(raw).success) return { email: raw };

    const phone = parsePhoneNumberFromString(raw, 'VN');
    if (phone?.isValid()) return { phone: phone.number };

    return { username: raw };
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
      throw new UnauthorizedException();
    }

    return {
      user,
      onSuccess: () => this.userRepo.recordSuccessfulAuthentication(user),
    };
  }
}
