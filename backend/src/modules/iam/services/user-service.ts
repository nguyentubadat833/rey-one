import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { authConfig } from '@/configs/auth.config';
import type { ConfigType } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/core';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain-role.entity';
import { UserNotFoundError } from '@/utils/errors/user.error';
import { User } from '@/persistence/entities/iam-user.entity';
import { UserLoadedPartyAndMembers } from '@/persistence/types/user-type';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) { }

  private resolveToMembers(members: { domainId: string, roleId: string }[], user: User) {
    return members.map((domain) =>
      this.em.create(DomainMember, {
        user,
        domain: this.em.getReference(Domain, domain.domainId),
        role: this.em.getReference(DomainRole, domain.roleId),
      }),
    )
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepo.create({
      password: dto.password ?? this.config.user.password.default,
      email: dto.email,
      username: dto.username,
      phone: dto.phone,
      type: 'user',
      party: {
        name: dto.name,
      },
    });

    user.members.set(this.resolveToMembers(dto.domains, user));

    await this.em.flush();
    return user as UserLoadedPartyAndMembers
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneOrFail(
      {
        id: userId
      },
      {
        populate: ['party'],
        failHandler: UserNotFoundError
      }
    )

    this.userRepo.assign(user,
      {
        password: dto.password,
        email: dto.email,
        username: dto.username,
        phone: dto.phone,
        party: {
          name: dto.name,
        },
      },
      {
        ignoreUndefined: true
      }
    )

    if (dto.domains) {
      user.members.set(this.resolveToMembers(dto.domains, user));
    }

    await this.em.flush()
    await user.members.load()
    return user as UserLoadedPartyAndMembers
  }
}
