import { UserRepository } from '@/persistence/repositories/user-repository';
import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { BaseLoginDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@/configs/auth.config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequireAuth } from '@/utils/decorators/auth.decorator';
import { UserLoginResponse, UserType } from '@rey-one/shared';
import { UserMapper } from '../mappers/user-mapper';
import { UserAuth } from '@/utils/types/system';
import { AuthService } from '../services/auth-service';
import { EntityManager } from '@mikro-orm/core';
import { User } from '@/persistence/entities/iam-user.entity';
import type { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

@ApiTags('IAM / Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Get user auth' })
  @RequireAuth()
  @Get()
  async getUserAuth(@CurrentUser('id') userId: string) {
    const user = await this.userRepo.findByIdentity({ id: userId });
    User.ensureExists(user)

    const loadedUser = await this.em.populate(user, ['party']);
    return UserMapper.toUserView(loadedUser);
  }

  @ApiOperation({ summary: 'Base login' })
  @Post('login')
  async baseLogin(@Body() dto: BaseLoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const { user, onSuccess } = await this.authService.baseAuthentication(dto);

    const userAuth = {
      id: user.id,
      type: user.type as UserType,
      domainAccess: await user.loadDomainAccess(),
    } satisfies UserAuth;

    const tokenExp = this.config.jwtAccessExpiresIn;
    const accessToken = await this.jwtService.signAsync(userAuth, {
      expiresIn: `${tokenExp}M`,
    });

    reply.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      //   sameSite: 'none',
      //   domain: '.remika.vn',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenExp * 60,
    });

    const loadedUser = await this.em.populate(user, ['party']);
    await onSuccess();

    return {
      accessToken: accessToken,
      user: UserMapper.toUserView(loadedUser),
    } satisfies UserLoginResponse;
  }
}
