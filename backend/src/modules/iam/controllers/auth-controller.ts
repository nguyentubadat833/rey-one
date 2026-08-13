import { Body, Controller, ForbiddenException, Get, Inject, NotFoundException, Post, Res, UnauthorizedException } from '@nestjs/common';
import { BaseLoginDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@/configs/auth.config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { UserLoginResponse } from '@rey-one/shared';
import { AppClsStore, UserAuth } from '@/utils/types/system';
import { AuthService } from '../services/auth-service';
import { EntityManager } from '@mikro-orm/core';
import { CurrentUser, MarkPublic } from '@/utils/decorators/utils.decorator';
import type { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';
import { UserMapper } from '../mappers/user-mapper';
import { ClsService } from 'nestjs-cls';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { AppError } from '@/utils/errors/app.error';

@RequireAuth()
@ApiTags('IAM / Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly clsStore: ClsService<AppClsStore>
  ) { }

  @ApiOperation({ summary: "Get auth info" })
  @Get()
  async getAuthInfo(@CurrentUser('id') userId: string) {
    const user = await this.userRepo.findByIdentity({ id: userId })
    if (!user) {
      throw new NotFoundException(AppError.withMessage('NOT_FOUND', "User not found"))
    }
    return UserMapper.userToUserAuth(user)
  }

  @MarkPublic()
  @ApiOperation({ summary: 'Base login' })
  @Post('login')
  async baseLogin(@Body() dto: BaseLoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const { user, onSuccess } = await this.authService.baseAuthentication(dto);

    const userAuth = {
      id: user.id,
      roleId: user.role.id,
      domainId: user.role.getProperty('domain')?.id,
      permissions: user.role.getProperty('permissions'),
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

    user.token = accessToken;
    await onSuccess();

    return {
      accessToken: accessToken,
      userAuth: UserMapper.userToUserAuth(user)
    } satisfies UserLoginResponse;
  }
}
