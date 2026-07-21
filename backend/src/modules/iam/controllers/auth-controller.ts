import { UserRepository } from '@/persistence/repositories/user-repository';
import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { BaseLoginDto } from '../dtos/auth-dto';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@/configs/auth.config';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequireAuth } from '@/utils/decorators/auth.decorator';
import { LoginResponse, UserType } from '@rey-one/shared';
import { UserMapper } from '../mappers/user-mapper';
import type { ConfigType } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

@ApiTags('IAM / Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  @RequireAuth()
  @Get()
  async getAuth(@CurrentUser('id') userId: string) {
    const user = await this.userRepo.getProfileById(userId);
    return UserMapper.toUserResponse(user);
  }

  @Post('login')
  async baseLogin(@Body() dto: BaseLoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const user = await this.userRepo.authenticateByPassword(dto.email, dto.password);

    const tokenExp = this.config.jwtAccessExpiresIn;
    const accessToken = await this.jwtService.signAsync(UserRepository.toObject(user), {
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

    await this.userRepo.recordSuccessfulAuthentication(user);

    return {
      token: accessToken,
      user: UserMapper.toUserResponse(user),
    } satisfies LoginResponse;
  }
}
