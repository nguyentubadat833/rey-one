import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { BaseLoginDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@/configs/auth.config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireAuth } from '@/utils/decorators/auth.decorator';
import { UserLoginResponse } from '@rey-one/shared';
import { UserAuth } from '@/utils/types/system';
import { AuthService } from '../services/auth-service';
import { EntityManager } from '@mikro-orm/core';
import { MarkPublic } from '@/utils/decorators/utils.decorator';
import type { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

@RequireAuth()
@ApiTags('IAM / Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

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
    } satisfies UserLoginResponse;
  }
}
