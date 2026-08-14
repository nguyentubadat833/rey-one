import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { authConfig } from '@/configs/auth.config';
import { EntityManager } from '@mikro-orm/core';
import type { ConfigType } from '@nestjs/config';
import { UserInfo } from '@/persistence/entities/user.entity';
import { Role } from '@/persistence/entities/role.entity';
import { RoleNotFoundError, UserNotFoundError } from '@/utils/errors/user.error';
import { AuthService } from './auth-service';
import { ClsService, ClsStore } from 'nestjs-cls';
import { AppClsStore } from '@/utils/types/system';
import { RoleService } from './role-service';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly appStore: ClsService<AppClsStore>,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  //   private resolveToMembers(members: UserMemberDto[], user: User) {
  //     return members.map((member) =>
  //       this.em.create(DomainMember, {
  //         user,
  //         domain: this.em.getReference(Domain, member.domain.id),
  //         role:  member.role ? this.em.getReference(DomainRole, member.role.id) : null,
  //       }),
  //     );
  //   }

  async createUser(dto: CreateUserDto) {

    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      password: this.config.userDefault.password,
      info: this.em.create(UserInfo, {
        name: dto.name,
        image: dto.image,
      }),
      role: dto.roleId ,
    });

    await this.em.flush();
    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {}
}
