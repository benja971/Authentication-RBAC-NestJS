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

    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      this.logger.verbose('Public route, skipping authorization');
      return true;
    }

    // Extract token and request
    const { token, request } = this.extractRequestAndToken(context);

    // Authenticate the request
    return this.authenticateRequest(token, request);
  }

  private async authenticateRequest(token: string, request: AuthenticatedRequest): Promise<boolean> {
    try {
      // Verify the JWT token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      this.logger.verbose(`Token verified successfully for user: ${payload.id}`);

      // Validate the refresh token
      const refreshToken = await this.refreshTokenService.findByUserId(payload.id);

      if (!refreshToken) {
        this.logger.error(`Unauthorized: Refresh token not found for user: ${payload.id}`);
        throw new UnauthorizedException('Invalid or expired token. Please log in again.');
      }

      // Attach the user payload to the request object
      request.user = payload;

      this.logger.log(`User ${payload.id} is authorized`);
      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private extractRequestAndToken(context: ExecutionContext): { token: string; request: AuthenticatedRequest } {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error('Unauthorized: Token not found in the header');
      throw new UnauthorizedException('Authorization token is missing.');
    }

    return { token, request };
  }

  private extractTokenFromHeader(request: Request): string {
    this.logger.verbose('Extracting token from the Authorization header');

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      this.logger.error('Invalid token format');
      throw new UnauthorizedException('Invalid token format. Please provide a valid Bearer token.');
    }

    return token;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
