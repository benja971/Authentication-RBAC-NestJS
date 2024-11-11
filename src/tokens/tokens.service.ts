import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtUserDto } from 'src/commons/types';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signJwtAccessToken(payload: JwtUserDto): string {
    return this.jwtService.sign(payload);
  }

  verifyJwtAccessToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  async signJwtRefreshToken(payload: JwtUserDto): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(''),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }

  verifyJwtRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
