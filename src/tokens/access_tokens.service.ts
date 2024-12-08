import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtUserDto } from 'src/commons/types';

@Injectable()
export class AccessTokensService {
  private readonly logger = new Logger(AccessTokensService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: JwtUserDto): string {
    this.logger.debug(`Signing access token for user ${payload.email}`);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  verify(token: string): boolean {
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
}
