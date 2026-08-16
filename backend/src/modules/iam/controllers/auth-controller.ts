import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Post, Res, UnauthorizedException } from '@nestjs/common';
import { BaseLoginDto, UserAuthResponseDto, UserLoginResponseDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@/configs/auth.config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { AppClsStore, UserAuth } from '@/utils/types/system';
import { AuthService } from '../services/auth-service';
import { EntityManager } from '@mikro-orm/core';
import { CurrentUser, MarkPublic } from '@/utils/decorators/utils.decorator';
import { UserMapper } from '../mappers/user-mapper';
import { ClsService } from 'nestjs-cls';
import { UserRepository } from '@/persistence/repositories/user-repository';
import { UserNotFoundError } from '@/utils/errors/user.error';
import type { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  //   sameSite: 'none',
  //   domain: '.remika.vn',
  sameSite: 'lax',
  path: '/',
} as const;



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
    private readonly clsStore: ClsService<AppClsStore>,
  ) {}

  @ApiOperation({ summary: 'Get current authentication info' })
  @ApiOkResponse({
    type: UserAuthResponseDto,
  })
  @Get()
  async getAuthInfo(@CurrentUser('id') userId: string) {
    const user = await this.userRepo.findOneOrFail(
      {
        id: userId,
      },
      {
        populate: ['info'],
        failHandler: UserNotFoundError,
      },
    );

    return UserMapper.toUserAuth(user);
  }

  @MarkPublic()
  @ApiOperation({ summary: 'Sign in', })
  @ApiOkResponse({
    type: UserLoginResponseDto
  })
  @Post('login')
  async baseLogin(@Body() dto: BaseLoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const { user, onSuccess } = await this.authService.baseAuthentication(dto);

    const userAuth = {
      id: user.id,
      domainId: user.domain?.id,
      permissions: user.permissions
    } satisfies UserAuth;

    const tokenExp = this.config.jwtAccessExpiresIn;
    const accessToken = await this.jwtService.signAsync(userAuth, {
      expiresIn: `${tokenExp}M`,
    });

    reply.setCookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: tokenExp * 60,
    });

    user.token = accessToken;
    await onSuccess();

    await this.em.populate(user, ['info']);
    return {
      accessToken: accessToken,
      userAuth: UserMapper.toUserAuth(user),
    } satisfies UserLoginResponseDto;
  }

  @MarkPublic()
  @ApiOperation({ summary: 'Sign out'})
  @Delete('logout')
  async logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.clearCookie('access_token', { ...COOKIE_OPTIONS });
  }
}
