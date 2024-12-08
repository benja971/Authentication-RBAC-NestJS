import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/commons/types';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';

export type AuthenticatedRequest = Request & { user: JwtPayload };

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokensService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('Checking if user is authorized');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    this.logger.debug(`isPublic: ${!!isPublic}`);

    if (isPublic) {
      this.logger.verbose('Public route, skipping authorization');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error(`Unauthorized: Token not found in header`);
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.secret'),
      });

      // if no refresh token, access token can't be used
      const refreshToken = await this.refreshTokenService.findByUserId(payload.id);

      if (!refreshToken) {
        this.logger.error(`Unauthorized: Refresh token not found in cookie`);
        throw new UnauthorizedException(`No refresh token found for user: ${payload.id}`);
      }

      request['user'] = payload;

      this.logger.log(`User: ${JSON.stringify(payload)} is authorized`);
    } catch {
      this.logger.error(`Unauthorized: ${token} is invalid (expired or tampered)`);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    this.logger.verbose('Extracting token from header');
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
