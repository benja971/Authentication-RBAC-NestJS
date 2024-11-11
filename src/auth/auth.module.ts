import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { RolesService } from 'src/roles/roles.service';
import { AccessTokensService } from 'src/tokens/access_tokens.service';
import { RefreshToken } from 'src/tokens/entities/refresh_token.entity';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    HashingService,
    RolesService,
    AccessTokensService,
    RefreshTokensService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
