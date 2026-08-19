import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/user-dto';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { authConfig } from '@/configs/auth.config';
import { EntityManager } from '@mikro-orm/core';
import { UserInfo } from '@/persistence/entities/user.entity';
import { UserNotFoundError } from '@/utils/errors/user.error';
import { UserLoadedInfo } from '@/persistence/types/user-type';
import type { ConfigType } from '@nestjs/config';



@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.userRepo.create({
      name: dto.name,
      image: dto.image,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      password: this.config.userDefault.password,
      permissions: dto.permissions,
    });

    await this.em.flush();
    return user as UserLoadedInfo;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneOrFail(
      { id },
      {
        failHandler: UserNotFoundError,
        populate: ['info'],
      },
    );

    this.userRepo.assign(
      user,
      {
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        permissions: dto.permissions,
      },
      {
        ignoreUndefined: true,
      },
    );

    this.em.assign(
      user.info,
      {
        name: dto.name,
        image: dto.image,
      },
      {
        ignoreUndefined: true,
      },
    );

    await this.em.flush();
    return user as UserLoadedInfo;
  }
}
