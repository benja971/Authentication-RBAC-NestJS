import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from 'src/commons/types';
import { AccessTokensService } from 'src/tokens/access_tokens.service';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';

export type AuthenticatedRequest = Request & { user: JwtPayload };

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly accessTokenService: AccessTokensService,
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
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error('Unauthorized: Token not found in the header');
      throw new UnauthorizedException('Authorization token is missing.');
    }

    // Authenticate the request
    return this.authenticateRequest(token, request);
  }

  private async authenticateRequest(token: string, request: AuthenticatedRequest): Promise<boolean> {
    try {
      // Verify the JWT token
      if (!this.accessTokenService.verify(token)) {
        this.logger.error('Unauthorized: Invalid token');
        throw new UnauthorizedException('Invalid or expired token. Please log in again.');
      }

      // Decode the token payload
      const payload = this.accessTokenService.decode(token);

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
