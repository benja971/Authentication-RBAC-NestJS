import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserJwtPayload } from 'src/auth/types';

@Injectable()
export class AccessTokensService {
  private readonly logger = new Logger(AccessTokensService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: UserJwtPayload): string {
    this.logger.log(`Signing access token for user ${payload.email}`);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  verify(token: string): boolean {
    this.logger.log(`Verifying access token`);
    try {
      return !!this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch (error) {
      this.logger.error(`Error verifying access token: ${error}`);
      return false;
    }
  }

  decode(token: string): JwtPayload {
    this.logger.log(`Decoding access token`);
    return this.jwtService.decode<JwtPayload>(token);
  }
}
