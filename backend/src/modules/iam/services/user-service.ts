import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { authConfig } from '@/configs/auth.config';
import type { ConfigType } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/core';
import { DomainMember } from '@/persistence/entities/iam-domain-member.entity';
import { Domain } from '@/persistence/entities/iam-domain.entity';
import { DomainRole } from '@/persistence/entities/iam-domain-role.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

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

    user.members.set(
      dto.domains.map((domain) =>
        this.em.create(DomainMember, {
          user,
          domain: this.em.getReference(Domain, domain.domainId),
          role: this.em.getReference(DomainRole, domain.roleId),
        }),
      ),
    );

    await this.em.flush();
    return user;
  }
}
