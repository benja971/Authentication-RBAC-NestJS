import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtUserDto } from 'src/commons/types';

@Injectable()
export class AccessTokensService {
  private readonly logger = new Logger(AccessTokensService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(payload: JwtUserDto): string {
    this.logger.debug(`Signing access token for user ${payload.email}`);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  signRefreshToken(payload: JwtUserDto): string {
    this.logger.debug(`Signing refresh token for user ${payload.email}`);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }

  verifyAccessToken(token: string): boolean {
    this.logger.debug(`Verifying access token`);
    try {
      return !!this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch (error) {
      this.logger.error(`Error verifying access token: ${error}`);
      return false;
    }
  }

  verifyRefreshToken(token: string): boolean {
    this.logger.debug(`Verifying refresh token`);
    try {
      return !!this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch (error) {
      this.logger.error(`Error verifying refresh token: ${error}`);
      return false;
    }
  }

  decodeToken(token: string): JwtPayload {
    this.logger.debug(`Decoding token`);
    return this.jwtService.decode(token);
  }
}
